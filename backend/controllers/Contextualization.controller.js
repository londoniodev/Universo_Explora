import { ContextualizationAnswer } from "../models/ContextualizationAnswer.js";
import { User } from "../models/user.model.js";

export const saveContextualizationAnswers = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { answers } = req.body;
    const userId = req.userId;

    if (!userId || !answers || !packageId) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    let existingEntry = await ContextualizationAnswer.findOne({ user: userId, package: packageId });

    if (existingEntry) {
      for (const [key, value] of Object.entries(answers)) {
        existingEntry.answers.set(key, value);
      }
    } else {
      existingEntry = new ContextualizationAnswer({ user: userId, package: packageId, answers });
    }

    await existingEntry.save();
    return res.status(200).json({ message: "Respuestas guardadas correctamente." });
  } catch (error) {
    console.error("Error al guardar respuestas:", error.message);
    return res.status(500).json({ message: "Error al guardar respuestas." });
  }
};

export const getContextualizationAnswers = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.userId;

    const answers = await ContextualizationAnswer.findOne({ user: userId, package: packageId });

    if (!answers) {
      return res.status(200).json({ answers: {} });
    }

    return res.status(200).json({ answers: answers.answers });
  } catch (error) {
    console.error("Error al obtener respuestas:", error.message);
    return res.status(500).json({ message: "Error al obtener respuestas." });
  }
};

export const getCompletedContextualizationAnswers = async (req, res) => {
  try {
    const userId = req.userId;
    const record = await ContextualizationAnswer.findOne({ user: userId, isCompleted: true });

    if (!record) {
      return res.status(404).json({ message: "No se encontraron respuestas para este test." });
    }

    return res.status(200).json({ answers: record.answers });
  } catch (error) {
    console.error("Error al obtener respuestas del test completado:", error.message);
    return res.status(500).json({ message: "Error al obtener respuestas del test." });
  }
};


export const completeTest = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.userId;

    const record = await ContextualizationAnswer.findOne({ user: userId, package: packageId });

    if (!record) {
      return res.status(404).json({ message: "Respuestas no encontradas." });
    }

    record.isCompleted = true;
    await record.save();

    res.status(200).json({ success: true, message: "Contextualización completada con éxito." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al completar la contextualización." });
  }
};