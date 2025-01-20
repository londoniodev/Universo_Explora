import { User } from "../models/user.model.js";

export const verifyTestPurchase = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    if (!user.purchasedTests || user.purchasedTests.length === 0) {
      return res.status(403).json({ success: false, message: "Acceso denegado. No has comprado ningún test." });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor", error: error.message });
  }
};
