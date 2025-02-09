import { User } from "../models/user.model.js";
import { Notification } from "../models/notification_for_psychologist.model.js";
import { getIO } from "../socket.js";

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
 * 📩 Genera solicitudes de asignación de psicólogo y emite evento en tiempo real
 */
export const requestPsychologist = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, message: "Usuario no encontrado" };

    const existingRequest = await Notification.findOne({ userId, status: "pending" });
    if (existingRequest) {
      return { success: false, message: "El usuario ya tiene una solicitud en curso." };
    }

    const availablePsychologists = await User.find({
      role: "psychologist",
      $expr: { $lt: [{ $size: { $ifNull: ["$assignedUsers", []] } }, MAX_USERS_PER_WEEK] },
    });

    if (availablePsychologists.length === 0) {
      return { success: false, message: "No hay psicólogos disponibles" };
    }

    for (const psychologist of availablePsychologists) {
      await Notification.create({ psychologistId: psychologist._id, userId });
    }

    // 🔥 Emitir evento en tiempo real SOLO a psicólogos
    try {
      getIO().emit("new-request", { userId });
    } catch (error) {
      console.warn("⚠️ Error emitiendo evento de solicitud:", error.message);
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

    // Buscar la solicitud
    const request = await Notification.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "La solicitud ya no existe." });
    }

    // Verificar que el psicólogo correcto responde
    if (String(request.psychologistId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "No autorizado para esta solicitud" });
    }

    // Buscar al usuario de la solicitud
    const user = await User.findById(request.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    if (action === "accept") {
      // Verificar que el usuario no tenga ya un psicólogo asignado
      if (user.psychologistAssigned?.id) {
        return res.status(400).json({ success: false, message: "Este usuario ya ha sido asignado a otro psicólogo." });
      }

      // Asignar el usuario al psicólogo
      user.psychologistAssigned = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        specialization: req.user.specialization || "General",
      };

      // Agregar usuario a la lista de asignados del psicólogo
      req.user.assignedUsers = req.user.assignedUsers || [];
      req.user.assignedUsers.push(user._id);
      req.user.lastAssigned = new Date();

      // Guardar los cambios
      await Promise.all([user.save(), req.user.save()]);

      // Eliminar todas las notificaciones de este usuario
      await Notification.deleteMany({ userId: request.userId });

      // 🔥 Emitir evento en tiempo real SOLO a ese psicólogo
      const io = getIO();
      io.to(req.user._id.toString()).emit("assigned-user", { psychologistId: req.user._id });

      request.status = "accepted";
    } else {
      request.status = "rejected";
      await request.save();
    }

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
      return { success: true, psychologist: user.psychologistAssigned };
    }

    const existingRequest = await Notification.findOne({ userId, status: "pending" });
    if (existingRequest) {
      return { success: true, message: "Esperando respuesta de los psicólogos." };
    }

    const availablePsychologists = await User.find({
      role: "psychologist",
      $expr: { $lt: [{ $size: { $ifNull: ["$assignedUsers", []] } }, MAX_USERS_PER_WEEK] },
    }).sort({ lastAssigned: 1 });

    if (availablePsychologists.length > 0) {
      for (const psychologist of availablePsychologists) {
        await Notification.create({ psychologistId: psychologist._id, userId });
      }

      // 🔥 Emitimos evento en tiempo real a los psicólogos
      try {
        getIO().emit("new-request", { userId });
      } catch (error) {
        console.warn("⚠️ Error emitiendo evento de solicitud automática:", error.message);
      }

      return { success: true, message: "Solicitudes enviadas a psicólogos disponibles." };
    }

    console.warn("⚠️ Ningún psicólogo aceptó. Asignando al Psicólogo de Última Opción...");

    return { success: false, message: "No hay psicólogos disponibles" };
  } catch (error) {
    console.error("❌ Error en la asignación automática:", error);
    return { success: false, message: "Error en el servidor" };
  }
};