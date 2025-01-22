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

    const totalQuestions = await Question.countDocuments();
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

export const getCalculatedResults = async (req, res) => {
  try {
    const userId = req.userId;
    const answers = await Answer.find({ user: userId });
    
    if (answers.length === 0) {
      return res.status(404).json({ message: "No se encontraron respuestas para el usuario." });
    }

    const factorResults = answers.reduce((acc, answer) => {
      const { factor, calculatedResult } = answer;

      if (!acc[factor]) {
        acc[factor] = { sum: 0, count: 0 };
      }

      acc[factor].sum += calculatedResult > 0 ? calculatedResult : 0;
      acc[factor].count += 1;

      return acc;
    }, {});

    const calculatedAverages = Object.entries(factorResults).map(([factor, data]) => ({
      factor,
      average: (data.sum / (data.count * 4)).toFixed(2),
    }));

    res.status(200).json({ success: true, results: calculatedAverages });
  } catch (error) {
    console.error("Error in getCalculatedResults:", error); 
    res.status(500).json({ message: "Error al obtener los resultados calculados." });
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