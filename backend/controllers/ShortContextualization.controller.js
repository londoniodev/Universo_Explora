import { ShortContextualizationAnswer } from "../models/ShortContextualizationAnswer.js";

export const saveShortContextualizationAnswers = async (req, res) => {
  try {
    const { user, answers } = req.body;
    const { userId } = req;
    const { packageId } = req.params;

    if (!user || !packageId || !answers) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    let existingEntry = await ShortContextualizationAnswer.findOne({ user: userId, package: packageId });

    if (existingEntry) {
      for (const [key, value] of Object.entries(answers)) {
        existingEntry.answers.set(key, value);
      }
    } else {
      existingEntry = new ShortContextualizationAnswer({ user: userId, package: packageId, answers });
    }

    const totalQuestions = 10; // Cambia este número según tus preguntas
    const isCompleted = existingEntry.answers.size >= totalQuestions;

    if (isCompleted) {
      existingEntry.isCompleted = true;
    }

    await existingEntry.save();
    
    return res.status(200).json({ message: "Respuestas guardadas correctamente." });
  } catch (error) {
    return res.status(500).json({ message: "Error al guardar las respuestas." });
  }
};

export const getShortContextualizationAnswers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { packageId } = req.params;

    if (!userId || !packageId) {
      return res.status(400).json({ message: "ID de usuario no proporcionado." });
    }

    const answers = await ShortContextualizationAnswer.findOne({ user: userId, package: packageId });

    if (!answers) {
      return res.status(404).json({ message: "Respuestas no encontradas para el usuario." });
    }

    return res.status(200).json({
      answers: answers.answers,
      isCompleted: answers.isCompleted,
    });
    
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las respuestas." });
  }
};
