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

    const isValid = Object.values(answers).every((category) =>
      Object.values(category).every((value) => typeof value == "number" && value >=1 && value <= 3
    ));

    if(isValid){
      return res.status(400).json({ message: "Las respuestas contienen valores inválidos." });
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

export const getcalculateAutoevaluationResults = async (req, res) => {
  try {
    const userId = req.userId;

    // Buscar las respuestas de la autoevaluación
    const record = await AutoevaluationAnswer.findOne({ user: userId });

    if (!record || !record.answers) {
      return res.status(404).json({ message: "No se encontraron respuestas para este test." });
    }

    const { affinity, performance } = record.answers;

    // Validar que existan respuestas en ambas categorías
    if (!affinity || !performance) {
      return res.status(400).json({ message: "Faltan respuestas de afinidad o desempeño." });
    }

    // Calcular promedios por área para afinidad y desempeño
    const areas = Object.keys(affinity); // Asumimos que ambas categorías tienen las mismas áreas
    const results = areas.map((area) => {
      const affinityScore = affinity[area] || 0; // Afinidad para el área (1-3)
      const performanceScore = performance[area] || 0; // Desempeño para el área (1-3)

      return {
        area,
        affinityScore: (affinityScore / 3) * 100, // Convertir a porcentaje (0-100)
        performanceScore: (performanceScore / 3) * 100, // Convertir a porcentaje (0-100)
      };
    });

    // Formatear la respuesta para la gráfica
    const graphData = {
      labels: results.map((result) => result.area), // Áreas como etiquetas de la gráfica
      affinity: results.map((result) => result.affinityScore), // Valores de afinidad
      performance: results.map((result) => result.performanceScore), // Valores de desempeño
    };

    res.status(200).json({ success: true, graphData });
  } catch (error) {
    console.error("Error al calcular resultados:", error);
    res.status(500).json({ message: "Error al calcular los resultados.", error: error.message });
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