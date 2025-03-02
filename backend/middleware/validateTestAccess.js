import { User } from "../models/user.model.js";

export const validateTestAccess = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { testType } = req.params;

    const user = await User.findById(userId).select("testProgress");

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const testStatus = user.testProgress[testType];

    if (!testStatus || testStatus === "locked") {
      return res.status(403).json({
        success: false,
        message: `El test ${testType} no está disponible.`,
      });
    }

    if (testStatus === "completed") {
      return res.status(403).json({
        success: false,
        message: `El test ${testType} ya ha sido completado.`,
      });
    }

    next();
  } catch (error) {
    console.error("Error al validar acceso al test:", error);
    res.status(500).json({
      success: false,
      message: "Error al validar el acceso al test.",
    });
  }
};