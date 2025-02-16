import { Psychologist } from "../models/psychologist.model.js";
import { User } from "../models/user.model.js";
import { Request } from "../models/request_for_psychologists.model.js";
import { getIO } from "../socket.js";

const MAX_USERS_PER_WEEK = 10;

/**
 * 📊 Dashboard del psicólogo: muestra pacientes asignados.
 */

export const handleAutoAssignment = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Falta el userId en la solicitud" });
    }
    const result = await assignPsychologistAutomatically(userId);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export const psychologistDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }

    // Buscar en `User` los pacientes que tienen asignado este psicólogo
    const assignedUsers = await User.find({ psychologistAssigned: req.user._id })
      .select("-password")
      .populate("psychologistAssigned", "name email");

    return res.status(200).json({
      success: true,
      assignedUsers,
      assignedCount: assignedUsers.length,
      maxAllowed: MAX_USERS_PER_WEEK,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};


/**
 * ✅ El psicólogo responde a una solicitud de asignación
 */
export const respondToRequest = async (req, res) => {
  try {

    const { requestId, action } = req.body;

    // Verificar que la solicitud existe
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "La solicitud ya no existe." });
    }

    // Verificar que el usuario existe
    const user = await User.findById(request.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    if (action === "accept") {
      // ✅ Asignar el usuario al psicólogo
      user.psychologistAssigned = req.user._id;
      await user.save();

      return res.status(200).json({ success: true, message: "Solicitud aceptada correctamente." });

    } else if (action === "reject") {
      // ✅ Eliminar SOLO la solicitud del psicólogo que la rechazó
      await Request.deleteOne({ _id: requestId });

      // ✅ Notificar SOLO al psicólogo que rechazó la solicitud
      getIO().to(`psychologist-${req.user._id}`).emit("request-removed", { userId: user._id });

      return res.status(200).json({ success: true, message: "Solicitud rechazada correctamente." });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

/**
 * 📋 Obtiene todas las solicitudes pendientes para el psicólogo
 */
export const getPendingRequests = async (req, res) => {
  try {
    if (!req.user || !req.user._id || req.user.role !== "psychologist") {
      console.warn("❌ Acceso denegado: Usuario no autenticado o no es psicólogo.");
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }

    console.log(`🔍 Obteniendo solicitudes para el psicólogo: ${req.user._id}`);

    const requests = await Request.find({ psychologistId: req.user._id }).populate("userId", "name email");

    if (!requests.length) {
      console.warn("⚠️ No hay solicitudes pendientes.");
    }

    console.log(`📋 Solicitudes encontradas: ${requests.length}`);

    return res.status(200).json({ success: true, requests });

  } catch (error) {
    console.error("❌ Error en getPendingRequests:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

/**
 * 🔄 Asigna automáticamente un psicólogo si no hay solicitudes en curso
 */
export const assignPsychologistAutomatically = async (userId) => {
  try {
    console.log(`🔍 Buscando usuario con ID: ${userId}`);
    const user = await User.findById(userId);
    if (!user) {
      console.warn("❌ Usuario no encontrado.");
      return { success: false, message: "Usuario no encontrado" };
    }

    if (user.psychologistAssigned) {
      console.log("✅ Usuario ya tiene un psicólogo asignado.");
      return { success: true, psychologist: user.psychologistAssigned };
    }

    const existingRequest = await Request.findOne({ userId });
    if (existingRequest) {
      console.log("⏳ Ya existe una solicitud en curso.");
      return { success: true, message: "Esperando respuesta de los psicólogos." };
    }

    console.log("🔍 Buscando psicólogos disponibles en la BD...");
    
    // 🔹 Ahora buscamos en `Psychologist`, no en `User`
    const approvedPsychologists = await Psychologist.find({ isApproved: true }).populate("userId");

    console.log(`📋 Psicólogos aprobados encontrados: ${approvedPsychologists.length}`);
    
    if (approvedPsychologists.length === 0) {
      console.warn("⚠️ No hay psicólogos disponibles.");
      return { success: false, message: "No hay psicólogos disponibles" };
    }

    // Crear solicitudes para cada psicólogo
    const requests = approvedPsychologists.map(psychologist => ({
      psychologistId: psychologist.userId._id,
      userId,
      status: "pending"
    }));

    await Request.insertMany(requests);
    console.log(`📩 Se enviaron solicitudes a ${approvedPsychologists.length} psicólogos.`);

    getIO().emit("new-request", { userId });

    return { success: true, message: "Solicitudes enviadas a todos los psicólogos disponibles." };
  } catch (error) {
    console.error("❌ Error en assignPsychologistAutomatically:", error);
    return { success: false, message: "Error en el servidor" };
  }
};