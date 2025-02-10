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
    console.error("❌ Error en asignación automática:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export const psychologistDashboard = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "psychologist") {
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }

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
    console.error("❌ Error en el dashboard del psicólogo:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};


/**
 * ✅ El psicólogo responde a una solicitud de asignación
 */
export const respondToRequest = async (req, res) => {
  try {
    console.log("📩 Solicitud recibida en respondToRequest:", req.body);

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

      // ✅ Eliminar TODAS las solicitudes del usuario (ya tiene psicólogo asignado)
      await Request.deleteMany({ userId: user._id });

      // ✅ Eliminar la solicitud de `requests` de todos los psicólogos
      await User.updateMany(
        { role: "psychologist" }, 
        { $pull: { requests: user._id } } // 🔥 Eliminar la solicitud en `requests`
      );

      // ✅ Notificar a TODOS los psicólogos para eliminar la solicitud
      getIO().emit("request-removed", { userId: user._id });

      return res.status(200).json({ success: true, message: "Solicitud aceptada correctamente." });

    } else if (action === "reject") {
      // ✅ Eliminar SOLO la solicitud del psicólogo que la rechazó
      await Request.deleteOne({ _id: requestId });

      // ✅ Eliminar de `requests` solo en el psicólogo que rechazó
      await User.findByIdAndUpdate(req.user._id, { 
        $pull: { requests: user._id } // 🔥 Eliminar de `requests` solo en el psicólogo actual
      });

      // ✅ Notificar SOLO al psicólogo que rechazó la solicitud
      getIO().to(`psychologist-${req.user._id}`).emit("request-removed", { userId: user._id });

      return res.status(200).json({ success: true, message: "Solicitud rechazada correctamente." });
    }

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
    console.log("🔍 Buscando solicitudes pendientes para:", req.user?._id);

    if (!req.user || !req.user._id) {
      return res.status(400).json({ success: false, message: "Usuario no autenticado" });
    }

    const requests = await Request.find({ psychologistId: req.user._id }).populate("userId", "name email");

    console.log("📋 Solicitudes encontradas:", requests);

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
      return { success: false, message: "Usuario no encontrado" };
    }

    if (user.psychologistAssigned) {
      return { success: true, psychologist: user.psychologistAssigned };
    }

    const existingRequest = await Request.findOne({ userId });
    if (existingRequest) {
      return { success: true, message: "Esperando respuesta de los psicólogos." };
    }

    const availablePsychologists = await User.find({ role: "psychologist" });

    if (availablePsychologists.length === 0) {
      return { success: false, message: "No hay psicólogos disponibles" };
    }

    // Crear solicitudes y agregarlas a `requests` de cada psicólogo
    const requests = [];
    for (const psychologist of availablePsychologists) {
      requests.push({
        psychologistId: psychologist._id,
        userId,
      });

      await User.findByIdAndUpdate(psychologist._id, { 
        $push: { requests: userId }  // 🔥 Añadir la solicitud en `requests`
      });
    }

    await Request.insertMany(requests);

    console.log(`📢 Enviando evento 'new-request' para el usuario: ${userId}`);
    getIO().emit("new-request", { userId });

    return { success: true, message: "Solicitudes enviadas a todos los psicólogos disponibles." };

  } catch (error) {
    console.error("❌ Error en la asignación automática:", error);
    return { success: false, message: "Error en el servidor" };
  }
};