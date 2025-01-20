import { AutoevaluationAnswer } from "../models/AutoevaluationAnswer.js";
import { ContextualizationAnswer } from "../models/ContextualizationAnswer.js";
import { Answer } from "../models/Sixteenpfanswers.model.js";
import { ShortContextualizationAnswer } from "../models/ShortContextualizationAnswer.js";


export const checkTestCompletion = (testType) => {
  return async (req, res, next) => {
    try {
      const { packageId } = req.params;
      const userId = req.userId;

      let record;
      if (testType === "autoevaluation") {
        record = await AutoevaluationAnswer.findOne({ user: userId, package: packageId });
      } else if (testType === "contextualization") {
        record = await ContextualizationAnswer.findOne({ user: userId, package: packageId });
      } else if (testType === "sixteenPF") {
        record = await Answer.findOne({ user: userId, package: packageId });
      }else if (testType === "shortContextualization") {
        record = await ShortContextualizationAnswer.findOne({ user: userId, package: packageId });
      }

      if (record?.isCompleted) {
        return res.status(403).json({ message: `El test "${testType}" ya está completado.` });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error al verificar el estado del test." });
    }
  };
};