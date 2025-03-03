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


      if (!mongoose.Types.ObjectId.isValid(packageId)) {
        console.warn("⚠️ Advertencia: packageId no es un ObjectId válido. Se usará como String.");
      } else {
        packageId = new mongoose.Types.ObjectId(packageId);
      }

      totalAccesses += access.quantity;

      let packageData = await PsychologistPackage.findById(packageId);
      if (!packageData) {

        packageData = await PsychologistPackage.create({
          _id: packageId,
          name: packageName,
          description: "Paquete generado automáticamente",
          price: access.price,
          durationDays: 30,
        });

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
      message: `Compra realizada con éxito. Se añadieron ${totalAccesses} accesos.`,
      accessBalance: psychologist.accessBalance,
      purchases,
    });
  } catch (error) {
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
    return res.status(500).json({ success: false, message: "Error al obtener la compra reciente." });
  }
};

/**
 * Obtiene el saldo actual de accesos del psicólogo.
 */
export const getPsychologistAccessBalance = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }


    const psychologist = await User.findById(req.user._id).select("accessBalance");

    if (!psychologist) {
      return res.status(404).json({ success: false, message: "Psicólogo no encontrado" });
    }

    
    return res.status(200).json({ success: true, accessBalance: psychologist.accessBalance });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
