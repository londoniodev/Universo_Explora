import { Answer } from "../models/Sixteenpfanswers.model.js";
import Question from "../models/Sixtenpfquestion.model.js";
import { UserProgress } from "../models/UserProgress.model.js";
import { User } from "../models/user.model.js";

export const saveAnswers = async (req, res) => {
  
  const { answers, currentQuestionIndex } = req.body;

  try {
    const userId = req.accessDetails.userId;
    const packageId = req.accessDetails.packageId;

    if (!answers) {
      return res.status(400).json({ message: "Faltan datos necesarios para guardar las respuestas." });
    }

    const totalQuestions = await Question.countDocuments({ isActive: true });
    const answerEntries = Object.entries(answers);

    const bulkOperations = await Promise.all(
      answerEntries.map(async ([questionId, selectedOption]) => {
        const question = await Question.findById(questionId);

        if (!question) {
          throw new Error(`La pregunta con ID ${questionId} no existe.`);
        }

        const selectedAnswer = question.opciones_respuesta.find(
          (option) => option.texto === selectedOption
        );

        if (!selectedAnswer) {
          throw new Error(`La opción seleccionada no es válida para la pregunta ${questionId}.`);
        }

        const calculatedResult = selectedAnswer.puntuacion * question.tipo_pregunta.polo;

        return {
          updateOne: {
            filter: { user: userId, question: questionId, package: packageId },
            update: {
              user: userId,
              package: packageId,
              question: questionId,
              selectedOption,
              score: selectedAnswer.puntuacion,
              factor: question.factor,
              polo: question.tipo_pregunta.polo,
              calculatedResult,
            },
            upsert: true,
          },
        };
      })
    );

    await Answer.bulkWrite(bulkOperations);

    const totalAnswers = await Answer.countDocuments({ user: userId, package: packageId });
    const isCompleted = totalAnswers === totalQuestions;

    if (isCompleted) {
      await Answer.updateMany({ user: userId, package: packageId }, { $set: { isCompleted: true } });
    }

    const user = await User.findById(userId);
    if (user) {
      user.testProgress.sixteenPF = isCompleted ? "completed" : "inProgress";
      await user.save();
    }

    await UserProgress.updateOne(
      { userId, packageId },
      { currentQuestionIndex },
      { upsert: true }
    );


    res.status(200).json({ message: "Respuestas guardadas correctamente.", isCompleted });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar respuestas.", error: error.message });
  }
};

export const getUserAnswers = async (req, res) => {
  try {
    const userId = req.accessDetails.userId;
    const packageId = req.accessDetails.packageId;

    const answers = await Answer.find({ user: userId, package: packageId }).select(
      "question selectedOption isCompleted"
    );

    const formattedAnswers = answers.reduce((acc, answer) => {
      acc[answer.question] = answer.selectedOption;
      return acc;
    }, {});

    const allAnswersCompleted = answers.every((answer) => answer.isCompleted === true);

    const isCompleted = answers.length === 162 && allAnswersCompleted;

    const userPackageData = await UserProgress.findOne({ userId, packageId });
    const currentQuestionIndex = userPackageData?.currentQuestionIndex || 0;

    res.status(200).json({
      success: true,
      answers: formattedAnswers,
      currentQuestionIndex,
      isCompleted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener respuestas", error: error.message });
  }
};

export const getCalculatedSixteenpfResults = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Recuperar respuestas poblando la pregunta asociada
    const answers = await Answer.find({ user: userId }).populate("question");
    
    if (answers.length === 0) {
      return res.status(404).json({ message: "No se encontraron respuestas para el usuario." });
    }

    // 1. Calcular promedios por factor (solo categoria: 'rasgo' y se_calcula_en_factor: true)
    const factorResults = {};
    
    answers.forEach((answer) => {
      const q = answer.question;
      if (!q) return;

      if (q.se_calcula_en_factor === true && q.categoria === "rasgo") {
        const factor = q.factor;
        const calculatedResult = answer.calculatedResult;

        if (!factorResults[factor]) {
          factorResults[factor] = { sum: 0, signedSum: 0, count: 0 };
        }

        const bipolarItemScore = (calculatedResult + 4) / 2;
        factorResults[factor].sum += bipolarItemScore;
        factorResults[factor].signedSum += calculatedResult;
        factorResults[factor].count += 1;
      }
    });

    const calculatedAverages = Object.entries(factorResults).map(([factor, item]) => {
      const average = item.count > 0 ? item.sum / (item.count * 4) : 0.5;
      const percentage = average * 100;
      const signedAverage = item.count > 0 ? item.signedSum / item.count : 0;
      const bipolarGraphValue = ((percentage - 50) / 50) * 12;

      return {
        factor,
        average: parseFloat(average.toFixed(4)),
        percentage: parseFloat(percentage.toFixed(2)),
        signedAverage: parseFloat(signedAverage.toFixed(4)),
        bipolarGraphValue: parseFloat(bipolarGraphValue.toFixed(2)),
      };
    });

    // 2. Calcular Índices de Calidad de Respuesta (responseQuality)
    // 2.1 Deseabilidad Social (desirabilityRate)
    const desSocialAnswers = answers.filter(a => a.question && a.question.indice_respuesta === "deseabilidad_social");
    const desSocialTotal = desSocialAnswers.length;
    const desSocialHighCount = desSocialAnswers.filter(a => a.score >= 2).length;
    const desirabilityRate = desSocialTotal > 0 ? desSocialHighCount / desSocialTotal : 0;
    
    let desirabilityStatus = "verde";
    let desirabilityFlags = 0;
    if (desirabilityRate >= 0.85) {
      desirabilityStatus = "rojo";
      desirabilityFlags = 2;
    } else if (desirabilityRate >= 0.70) {
      desirabilityStatus = "amarillo";
      desirabilityFlags = 1;
    }

    // 2.2 Infrecuencia (infrequencyRate)
    const infrecAnswers = answers.filter(a => a.question && a.question.indice_respuesta === "infrecuencia");
    const infrecTotal = infrecAnswers.length;
    const infrecHighCount = infrecAnswers.filter(a => a.score >= 2).length;
    const infrequencyRate = infrecTotal > 0 ? infrecHighCount / infrecTotal : 0;
    
    let infrequencyStatus = "verde";
    let infrequencyFlags = 0;
    if (infrequencyRate >= 0.70) {
      infrequencyStatus = "rojo";
      infrequencyFlags = 2;
    } else if (infrequencyRate >= 0.50) {
      infrequencyStatus = "amarillo";
      infrequencyFlags = 1;
    }

    // 2.3 Atención (attentionFails)
    const attentionAnswers = answers.filter(a => a.question && a.question.indice_respuesta === "atencion");
    let attentionFails = 0;
    attentionAnswers.forEach(a => {
      if (a.selectedOption !== a.question.attention_expected_response) {
        attentionFails += 1;
      }
    });
    
    let attentionStatus = "verde";
    let attentionFlags = 0;
    if (attentionFails >= 2) {
      attentionStatus = "rojo";
      attentionFlags = 2;
    } else if (attentionFails === 1) {
      attentionStatus = "amarillo";
      attentionFlags = 1;
    }

    // 2.4 Aquiescencia (agreeRate)
    const totalAnswersCount = answers.length;
    const agreeCount = answers.filter(a => a.score > 0).length;
    const agreeRate = totalAnswersCount > 0 ? agreeCount / totalAnswersCount : 0;
    
    let agreeStatus = "verde";
    let agreeFlags = 0;
    if (agreeRate >= 0.85) {
      agreeStatus = "rojo";
      agreeFlags = 2;
    } else if (agreeRate >= 0.75) {
      agreeStatus = "amarillo";
      agreeFlags = 1;
    }

    // 2.5 Uso Excesivo de Neutral (neutralRate)
    const rasgoAnswers = answers.filter(a => a.question && a.question.categoria === "rasgo");
    const rasgoTotal = rasgoAnswers.length;
    const neutralCount = rasgoAnswers.filter(a => a.score === 0).length;
    const neutralRate = rasgoTotal > 0 ? neutralCount / rasgoTotal : 0;
    
    let neutralStatus = "verde";
    let neutralFlags = 0;
    if (neutralRate >= 0.50) {
      neutralStatus = "rojo";
      neutralFlags = 2;
    } else if (neutralRate >= 0.35) {
      neutralStatus = "amarillo";
      neutralFlags = 1;
    }

    // 2.6 Inconsistencia (inconsistencyCount)
    const pairsMap = {};
    answers.forEach(a => {
      if (a.question && a.question.consistency_pair_id) {
        const pairId = a.question.consistency_pair_id;
        if (!pairsMap[pairId]) {
          pairsMap[pairId] = [];
        }
        pairsMap[pairId].push(a);
      }
    });
    
    let inconsistencyCount = 0;
    Object.entries(pairsMap).forEach(([pairId, pairAnswers]) => {
      if (pairAnswers.length === 2) {
        const diff = Math.abs(pairAnswers[0].calculatedResult - pairAnswers[1].calculatedResult);
        if (diff >= 6) {
          inconsistencyCount += 1;
        }
      }
    });
    
    let inconsistencyStatus = "verde";
    let inconsistencyFlags = 0;
    if (inconsistencyCount >= 7) {
      inconsistencyStatus = "rojo";
      inconsistencyFlags = 2;
    } else if (inconsistencyCount >= 4) {
      inconsistencyStatus = "amarillo";
      inconsistencyFlags = 1;
    }

    // 2.7 Patrón Mecánico (mechanicalPattern)
    const sortedAnswers = [...answers].filter(a => a.question && typeof a.question.orden_aplicacion === 'number')
      .sort((a, b) => a.question.orden_aplicacion - b.question.orden_aplicacion);
      
    let mechanicalPattern = 0;
    let currentRun = 0;
    let lastOption = null;
    
    sortedAnswers.forEach(a => {
      const opt = a.selectedOption;
      if (opt === lastOption) {
        currentRun += 1;
      } else {
        currentRun = 1;
        lastOption = opt;
      }
      if (currentRun > mechanicalPattern) {
        mechanicalPattern = currentRun;
      }
    });
    
    let mechanicalStatus = "verde";
    let mechanicalFlags = 0;
    if (mechanicalPattern >= 12) {
      mechanicalStatus = "amarillo";
      mechanicalFlags = 1;
    }

    // 2.8 Semáforo Global (globalLevel)
    const totalFlags = desirabilityFlags + infrequencyFlags + attentionFlags + agreeFlags + neutralFlags + inconsistencyFlags + mechanicalFlags;
    let globalLevel = "verde";
    if (totalFlags >= 4) {
      globalLevel = "rojo";
    } else if (totalFlags >= 2) {
      globalLevel = "amarillo";
    }

    const responseQuality = {
      desirabilityRate: { value: parseFloat(desirabilityRate.toFixed(4)), status: desirabilityStatus, flags: desirabilityFlags },
      infrequencyRate: { value: parseFloat(infrequencyRate.toFixed(4)), status: infrequencyStatus, flags: infrequencyFlags },
      attentionFails: { value: attentionFails, status: attentionStatus, flags: attentionFlags },
      agreeRate: { value: parseFloat(agreeRate.toFixed(4)), status: agreeStatus, flags: agreeFlags },
      neutralRate: { value: parseFloat(neutralRate.toFixed(4)), status: neutralStatus, flags: neutralFlags },
      inconsistencyCount: { value: inconsistencyCount, status: inconsistencyStatus, flags: inconsistencyFlags },
      mechanicalPattern: { value: mechanicalPattern, status: mechanicalStatus, flags: mechanicalFlags },
      global: { flags: totalFlags, level: globalLevel }
    };

    res.status(200).json({ success: true, results: calculatedAverages, responseQuality });
  } catch (error) {
    console.error("Error in getCalculatedSixteenpfResults:", error); 
    res.status(500).json({ message: "Error al obtener los resultados calculados.", error: error.message });
  }
};

export const completeTest = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.accessDetails.userId;

    const recordExists = await Answer.exists({ user: userId, package: packageId });

    if (!recordExists) {
      return res.status(404).json({ message: "Respuestas no encontradas." });
    }

    const updateResult = await Answer.updateMany(
      { user: userId, package: packageId },
      { $set: { isCompleted: true } }
    );

    const user = await User.findById(userId);
    if (user) {
      user.testProgress.sixteenPF = "completed";
      await user.save();
    }

    res.status(200).json({ success: true, message: "Test 16PF completado con éxito." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al completar el test 16PF." });
  }
};