import { User } from "../models/user.model.js";
import { Notification } from "../models/notification_for_psychologist.model.js";

const MAX_USERS_PER_WEEK = 10;

/**
 * 📊 Dashboard del psicólogo: muestra pacientes asignados.
 */
export const psychologistDashboard = async (req, res) => {
  try {
    if (req.user.role !== "psychologist") {
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }

    const assignedUsers = await User.find({
      "psychologistAssigned.id": req.user._id,
    }).select("-password");

    console.log(`📊 Psicólogo ${req.user._id} tiene ${assignedUsers.length} pacientes asignados.`);

    return res.status(200).json({
      success: true,
      assignedUsers,
      assignedCount: assignedUsers.length,
      maxAllowed: MAX_USERS_PER_WEEK,
    });
  } catch (error) {
    console.error("❌ Error en el dashboard del psicólogo:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

/**
 * 📩 Genera solicitudes de asignación de psicólogo
 */
export const requestPsychologist = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, message: "Usuario no encontrado" };

    // Verificar si ya existe una solicitud pendiente para este usuario
    const existingRequest = await Notification.findOne({ userId, status: "pending" });
    if (existingRequest) {
      return { success: false, message: "El usuario ya tiene una solicitud en curso." };
    }

    // Buscar psicólogos disponibles
    const availablePsychologists = await User.find({
      role: "psychologist",
      $expr: { $lt: [{ $size: { $ifNull: ["$assignedUsers", []] } }, MAX_USERS_PER_WEEK] },
    });

    if (availablePsychologists.length === 0) {
      return { success: false, message: "No hay psicólogos disponibles" };
    }

    // Crear solicitudes para cada psicólogo disponible
    for (const psychologist of availablePsychologists) {
      await Notification.create({ psychologistId: psychologist._id, userId });
    }

    return { success: true, message: "Solicitudes enviadas a los psicólogos" };
  } catch (error) {
    console.error("❌ Error al solicitar psicólogo:", error);
    return { success: false, message: "Error en el servidor" };
  }
};

/**
 * ✅ El psicólogo responde a una solicitud de asignación
 */
export const respondToRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const request = await Notification.findById(requestId);

    if (!request) return res.status(404).json({ success: false, message: "Solicitud no encontrada" });

    // Verificar que el psicólogo sea el destinatario de la solicitud
    if (String(request.psychologistId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "No autorizado para esta solicitud" });
    }

    if (action === "accept") {
      // Asignar el usuario al psicólogo
      const user = await User.findById(request.userId);
      user.psychologistAssigned = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        specialization: req.user.specialization || "General",
      };

      req.user.assignedUsers = req.user.assignedUsers || [];
      req.user.assignedUsers.push(user._id);
      req.user.lastAssigned = new Date();

      await user.save();
      await req.user.save();
      request.status = "accepted";
    } else {
      request.status = "rejected";
    }

    await request.save();
    return res.status(200).json({ success: true, message: `Solicitud ${action} correctamente.` });
  } catch (error) {
    console.error("❌ Error al responder solicitud:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

/**
 * 📋 Obtiene todas las solicitudes pendientes para el psicólogo
 */
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await Notification.find({
      psychologistId: req.user._id,
      status: "pending",
    }).populate("userId", "name email");

    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("❌ Error al obtener solicitudes:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

/**
 * 🔄 Asigna automáticamente un psicólogo si no hay solicitudes en curso
 */
export const assignPsychologistAutomatically = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`⚠️ Usuario con ID ${userId} no encontrado.`);
      return { success: false, message: "Usuario no encontrado" };
    }

    if (user.psychologistAssigned?.id) {
      console.warn(`⚠️ Usuario ${userId} ya tiene un psicólogo asignado.`);
      return { success: true, psychologist: user.psychologistAssigned };
    }

    // Verificar si ya hay solicitudes en curso
    const existingRequest = await Notification.findOne({ userId, status: "pending" });
    if (existingRequest) {
      console.log("⏳ El usuario ya tiene una solicitud en curso, esperando respuesta.");
      return { success: true, message: "Esperando respuesta de los psicólogos." };
    }

    console.log(`🔍 Buscando psicólogo disponible para usuario ${userId}...`);

    const availablePsychologists = await User.find({
      role: "psychologist",
      $expr: { $lt: [{ $size: { $ifNull: ["$assignedUsers", []] } }, MAX_USERS_PER_WEEK] },
    }).sort({ lastAssigned: 1 });

    if (availablePsychologists.length > 0) {
      // Enviar solicitudes en vez de asignar directamente
      for (const psychologist of availablePsychologists) {
        await Notification.create({ psychologistId: psychologist._id, userId });
      }
      return { success: true, message: "Solicitudes enviadas a psicólogos disponibles." };
    }

    console.warn("⚠️ Ningún psicólogo aceptó. Asignando al Psicólogo de Última Opción...");

    // 🚨 Si nadie acepta, asignamos el `fallback_psychologist`
    const fallbackPsychologist = await User.findOne({ role: "fallback_psychologist" });
    if (!fallbackPsychologist) {
      console.error("❌ No hay psicólogos de respaldo disponibles.");
      return { success: false, message: "No hay psicólogos disponibles" };
    }

    user.psychologistAssigned = {
      id: fallbackPsychologist._id,
      name: fallbackPsychologist.name,
      email: fallbackPsychologist.email,
      specialization: "General",
    };

    fallbackPsychologist.assignedUsers = fallbackPsychologist.assignedUsers || [];
    fallbackPsychologist.assignedUsers.push(user._id);
    fallbackPsychologist.lastAssigned = new Date();

    await user.save();
    await fallbackPsychologist.save();

    console.log(`✅ Usuario ${user._id} asignado a Psicólogo de Última Opción: ${fallbackPsychologist.name}.`);

    return { success: true, psychologist: user.psychologistAssigned };
  } catch (error) {
    console.error("❌ Error en la asignación automática:", error);
    return { success: false, message: "Error en el servidor" };
  }
};