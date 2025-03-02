import { Psychologist } from "../models/psychologist.model.js";
import { User } from "../models/user.model.js";
import { Request } from "../models/request_for_psychologists.model.js";
import { getIO } from "../socket.js";

const MAX_USERS_PER_WEEK = 10;

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

export const respondToRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "La solicitud ya no existe." });
    }

    const user = await User.findById(request.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    if (action === "accept") {
      user.psychologistAssigned = req.user._id;
      await user.save();

      await Request.deleteMany({ userId: user._id });

      getIO().emit("request-removed", { userId: user._id });

      return res.status(200).json({ success: true, message: "Solicitud aceptada correctamente." });
    }

    if (action === "reject") {
      await Request.deleteOne({ _id: requestId });

      const remainingRequests = await Request.find({ userId: user._id });

      if (remainingRequests.length === 0) {
        console.warn(`⚠️ Todos los psicólogos rechazaron la solicitud de ${user._id}, asignando al fallback_psychologist...`);

        const fallbackPsychologist = await User.findOne({ role: "fallback_psychologist" });

        if (!fallbackPsychologist) {
          return res.status(500).json({ success: false, message: "No hay fallback_psychologist disponible." });
        }

        user.psychologistAssigned = fallbackPsychologist._id;
        await user.save();

        getIO().to(`psychologist-${fallbackPsychologist._id}`).emit("assigned-user", {
          psychologistId: fallbackPsychologist._id,
          userId: user._id,
          message: `Se te ha asignado un nuevo paciente: ${user.name}`,
        });

        return res.status(200).json({ success: true, message: "Asignado automáticamente al fallback_psychologist." });
      }

      getIO().to(`psychologist-${req.user._id}`).emit("request-removed", { userId: user._id });

      return res.status(200).json({ success: true, message: "Solicitud rechazada correctamente." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error en el servidor." });
  }
};


export const getPendingRequests = async (req, res) => {
  try {
    if (!req.user || !req.user._id || (req.user.role !== "psychologist" && req.user.role !== "fallback_psychologist")) {
      console.warn("Acceso denegado: Usuario no autenticado o sin permisos.");
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }

    const requests = await Request.find({ psychologistId: req.user._id })
      .populate({
        path: "userId",
        select: "name email",
      });

    return res.status(200).json({ success: true, requests });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

export const assignPsychologistAutomatically = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    if (user.psychologistAssigned) {
      return { success: true, psychologist: user.psychologistAssigned, message: "El usuario ya tiene un psicólogo asignado." };
    }

    const existingRequest = await Request.findOne({ userId });
    if (existingRequest) {
      return { success: true, message: "El usuario ya tiene solicitudes pendientes con psicólogos." };
    }

    const approvedPsychologists = await Psychologist.find({ isApproved: true })
      .populate({ path: "userId", match: { role: "psychologist" } })
      .sort({ assignedUsersCount: 1 });

    const availablePsychologists = approvedPsychologists.filter(psychologist => psychologist.userId);

    if (availablePsychologists.length > 0) {
      const requests = availablePsychologists.map(psychologist => ({
        psychologistId: psychologist.userId._id,
        userId,
        status: "pending",
      }));

      await Request.insertMany(requests);
      getIO().emit("new-request", { userId });

      return { success: true, message: "Solicitudes enviadas a los psicólogos disponibles." };
    }

    console.warn("⚠️ No hay psicólogos disponibles, asignando directamente al fallback_psychologist...");

    const fallbackPsychologist = await User.findOne({ role: "fallback_psychologist" });

    if (!fallbackPsychologist) {
      return { success: false, message: "No hay fallback_psychologist disponible." };
    }

    user.psychologistAssigned = fallbackPsychologist._id;
    await user.save();

    getIO().to(`psychologist-${fallbackPsychologist._id}`).emit("assigned-user", {
      psychologistId: fallbackPsychologist._id,
      userId: user._id,
      message: `Se te ha asignado automáticamente un nuevo paciente: ${user.name}.`,
    });

    getIO().to(`psychologist-${fallbackPsychologist._id}`).emit("update-assigned-users");

    return { success: true, psychologist: fallbackPsychologist, message: "Usuario asignado al fallback_psychologist automáticamente." };
  } catch (error) {
    return { success: false, message: "Error en el servidor." };
  }
};