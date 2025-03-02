import { User } from "../models/user.model.js";
import { PsychologistAccessPurchase } from "../models/PsychologistAccessPurchase.model.js";
import { PsychologistPackage } from "../models/PsychologistPackage.model.js";
import mongoose from "mongoose";
/**
 * Maneja la compra de accesos para los psicólogos.
 */
export const handlePsychologistPurchase = async (req, res) => {
  try {
    const psychologistId = req.userId;
    const { purchasedAccesses, paymentMethod } = req.body;

    const psychologist = await User.findById(psychologistId);
    if (!psychologist || (psychologist.role !== "psychologist" && psychologist.role !== "fallback_psychologist")) {
      return res.status(403).json({ success: false, message: "No tienes permisos para comprar accesos." });
    }

    if (!Array.isArray(purchasedAccesses) || purchasedAccesses.length === 0) {
      return res.status(400).json({ success: false, message: "Datos de compra inválidos." });
    }

    let totalAccesses = 0;
    const purchases = [];

    for (const access of purchasedAccesses) {
      let packageId = access.packageId;
      let packageName = access.packageName || "Paquete sin nombre";

      if (!packageId) {
        return res.status(400).json({ success: false, message: "ID del paquete inválido." });
      }

      console.log("🔍 Buscando paquete con ID:", packageId);

      if (!mongoose.Types.ObjectId.isValid(packageId)) {
        console.warn("⚠️ Advertencia: packageId no es un ObjectId válido. Se usará como String.");
      } else {
        packageId = new mongoose.Types.ObjectId(packageId);
      }

      totalAccesses += access.quantity;

      let packageData = await PsychologistPackage.findById(packageId);
      if (!packageData) {
        console.warn("Paquete no encontrado. Creando automáticamente...");

        packageData = await PsychologistPackage.create({
          _id: packageId,
          name: packageName,
          description: "Paquete generado automáticamente",
          price: access.price,
          durationDays: 30,
        });

        console.log("✅ Paquete creado automáticamente:", packageData);
      }

      const newPurchase = await PsychologistAccessPurchase.create({
        psychologistId,
        packageId: packageData._id,
        packageName: packageData.name,
        quantity: access.quantity,
        price: access.price,
        paymentMethod: paymentMethod || "manual",
        paymentStatus: "completed",
        purchasedAt: new Date(),
      });

      purchases.push(newPurchase);
    }

    psychologist.accessBalance = (psychologist.accessBalance || 0) + totalAccesses;
    await psychologist.save();

    return res.status(200).json({
      success: true,
      message: `✅ Compra realizada con éxito. Se añadieron ${totalAccesses} accesos.`,
      accessBalance: psychologist.accessBalance,
      purchases,
    });
  } catch (error) {
    console.error("❌ Error al procesar la compra de accesos:", error);
    return res.status(500).json({ success: false, message: "Error al procesar la compra de accesos." });
  }
};


/**
 * Obtiene el historial de compras de accesos de un psicólogo.
 */
export const getPsychologistPurchases = async (req, res) => {
  try {
    const psychologistId = req.userId;

    const purchases = await PsychologistAccessPurchase.find({ psychologistId }).sort({ purchasedAt: -1 });

    return res.status(200).json({
      success: true,
      purchases,
    });
  } catch (error) {
    console.error("Error al obtener compras de accesos:", error);
    return res.status(500).json({ success: false, message: "Error al obtener compras de accesos." });
  }
};

/**
 * Obtiene la compra más reciente del psicólogo.
 */
export const getRecentPsychologistPurchase = async (req, res) => {
  try {
    const psychologistId = req.userId;

    const lastPurchase = await PsychologistAccessPurchase.findOne({ psychologistId })
      .sort({ purchasedAt: -1 })
      .lean();

    if (!lastPurchase) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron compras recientes.",
      });
    }

    return res.status(200).json({
      success: true,
      recentPurchase: lastPurchase,
    });
  } catch (error) {
    console.error("Error al obtener la compra reciente:", error);
    return res.status(500).json({ success: false, message: "Error al obtener la compra reciente." });
  }
};

/**
 * Obtiene el saldo actual de accesos del psicólogo.
 */
export const getPsychologistAccessBalance = async (req, res) => {
  try {
    console.log("🧐 Buscando saldo de accesos para el psicólogo:", req.user?._id);
    
    if (!req.user) {
      console.warn("⚠️ req.user es undefined en getPsychologistAccessBalance");
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }

    console.log("✅ Usuario autenticado:", req.user);

    const psychologist = await User.findById(req.user._id).select("accessBalance");

    if (!psychologist) {
      console.warn("⚠️ Psicólogo no encontrado en la base de datos");
      return res.status(404).json({ success: false, message: "Psicólogo no encontrado" });
    }

    console.log("✅ Saldo encontrado:", psychologist.accessBalance);
    
    return res.status(200).json({ success: true, accessBalance: psychologist.accessBalance });

  } catch (error) {
    console.error("❌ Error al obtener el saldo de accesos:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
