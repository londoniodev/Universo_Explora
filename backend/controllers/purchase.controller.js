import { User } from "../models/user.model.js";
import { UserPackageAccess } from "../models/UserPackageAccess.model.js";
import { generateTestAccessToken } from "../utils/testAccessToken.utils.js";
import { assignPsychologistAutomatically } from "../controllers/psychologist.controller.js";

export const handlePurchase = async (req, res) => {
  try {
    const userId = req.userId;
    const { purchasedTests, paymentMethod, accessQuantity } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    if (user.role === "psychologist") {
      if (!accessQuantity || accessQuantity <= 0) {
        return res.status(400).json({ success: false, message: "Cantidad de accesos inválida" });
      }

      user.accessBalance = (user.accessBalance || 0) + accessQuantity;
      await user.save();

      return res.status(200).json({
        success: true,
        message: `Compra exitosa. Se añadieron ${accessQuantity} accesos.`,
        accessBalance: user.accessBalance,
      });
    }

    if (!Array.isArray(purchasedTests) || purchasedTests.length === 0) {
      return res.status(400).json({ success: false, message: "Datos de compra inválidos" });
    }

    const results = [];
    for (const test of purchasedTests) {
      const token = generateTestAccessToken({ userId, packageId: test.id }, null);
      const newAccess = await UserPackageAccess.create({
        userId,
        packageId: test.id,
        token,
        isPermanent: true,
        paymentMethod: paymentMethod || "manual",
        paymentStatus: "completed",
      });
      results.push(newAccess);
    }

    user.purchasedTests.push(...purchasedTests);
    user.cart = [];
    await user.save();

    let psychologist = null;
    try {
      const assignResult = await assignPsychologistAutomatically(userId);
      if (assignResult?.success && assignResult.psychologist) {
        psychologist = assignResult.psychologist;
      }
    } catch (error) {
      console.error("⚠️ Error asignando psicólogo:", error);
    }

    return res.status(200).json({
      success: true,
      message: psychologist
        ? "Compra realizada con éxito y psicólogo asignado automáticamente."
        : "Compra realizada con éxito.",
      results,
      psychologist,
      user,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al procesar la compra" });
  }
};


export const getRecentPurchase = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId, "purchasedTests").lean();

    if (!user || !user.purchasedTests || user.purchasedTests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron compras recientes.",
        recentPurchase: [],
      });
    }

    const recentPurchase = user.purchasedTests[user.purchasedTests.length - 1];

    res.status(200).json({
      success: true,
      recentPurchase: [recentPurchase],
    });
  } catch (error) {
    console.error("Error al obtener la compra reciente:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la compra reciente.",
      error: error.message,
    });
  }
};