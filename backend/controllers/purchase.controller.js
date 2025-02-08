import { User } from "../models/user.model.js";
import { UserPackageAccess } from "../models/UserPackageAccess.model.js";
import { generateTestAccessToken } from "../utils/testAccessToken.utils.js";
import { assignPsychologistAutomatically } from "../controllers/psychologist.controller.js";

export const handlePurchase = async (req, res) => {
  try {
    const userId = req.userId;
    const { purchasedTests, paymentMethod } = req.body;

    if (!Array.isArray(purchasedTests) || purchasedTests.length === 0) {
      return res.status(400).json({ success: false, message: "Datos de compra inválidos" });
    }

    console.log(`🛒 Procesando compra para el usuario: ${userId}`);

    // 📌 Procesar cada test comprado y generar un acceso
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

    // 📌 Vaciar carrito y actualizar compras del usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { purchasedTests: purchasedTests.map((test) => ({ ...test })) },
        $set: { cart: [] }
      },
      { new: true } // ✅ Devolvemos el usuario actualizado
    ).select("-password");

    console.log("✅ Compra realizada, asignando psicólogo...");

    let psychologist = null;
    try {
      const assignResult = await assignPsychologistAutomatically(userId);
      if (assignResult?.success) {
        psychologist = assignResult.psychologist;
        console.log(`✅ Psicólogo asignado: ${psychologist.name}`);
      } else {
        console.warn("⚠️ No se pudo asignar un psicólogo automáticamente.");
      }
    } catch (error) {
      console.error("⚠️ Error asignando psicólogo:", error);
    }

    return res.status(200).json({
      success: true,
      message: psychologist
        ? "Compra realizada con éxito y psicólogo asignado automáticamente."
        : "Compra realizada con éxito, pero no se pudo asignar un psicólogo automáticamente.",
      results,
      psychologist,
      user: updatedUser, // ✅ Enviamos el usuario actualizado en la respuesta
    });

  } catch (error) {
    console.error("❌ ERROR en `handlePurchase`:", error);
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