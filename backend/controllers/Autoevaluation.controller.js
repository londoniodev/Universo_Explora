import { AutoevaluationAnswer } from '../models/AutoevaluationAnswer.js';
import { User } from "../models/user.model.js";


export const saveAutoevaluation = async (req, res) => {
  try {
    const { answers } = req.body;
    const { packageId } = req.params;
    const userId = req.userId;

    if (!answers || !packageId || !userId) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    const existingRecord = await AutoevaluationAnswer.findOne({ user: userId, package: packageId });
    if (existingRecord?.isCompleted) {
      return res.status(403).json({ message: "El test ya está completado. No puedes guardar más respuestas." });
    }

    await AutoevaluationAnswer.updateOne(
      { user: userId, package: packageId },
      { user: userId, package: packageId, answers },
      { upsert: true }
    );

    const user = await User.findById(userId);
    if (user) {
      user.testProgress.autoevaluation = "inProgress";
      await user.save();
    }

    res.status(200).json({ message: "Respuestas guardadas correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar respuestas.", error: error.message });
  }
};

export const loadAutoevaluation = async (req, res) => {
  try {
    const { packageId, userId } = req.params;

    if (!packageId || !userId) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    const record = await AutoevaluationAnswer.findOne({ user: userId, package: packageId });

    if (!record) {
      return res.status(200).json({ answers: {}, isCompleted: false });
    }

    res.status(200).json({ answers: record.answers, isCompleted: record.isCompleted });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener respuestas.", error: error.message });
  }
};

export const completeTest = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.userId;

    const record = await AutoevaluationAnswer.findOne({ user: userId, package: packageId });

    if (!record) {
      return res.status(404).json({ message: "Respuestas no encontradas." });
    }

    record.isCompleted = true;
    await record.save();

    const user = await User.findById(userId);
    if (user) {
      user.testProgress.autoevaluation = "completed";
      await user.save();
    }

    res.status(200).json({ success: true, message: "Autoevaluación completada con éxito." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al completar la autoevaluación." });
  }
};