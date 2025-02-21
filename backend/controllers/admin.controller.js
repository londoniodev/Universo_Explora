import { User } from "../models/user.model.js";
import { getIO } from "../socket.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener usuarios" });
  }
};

export const updateUserRole = async (req, res) => {
  const { newRole } = req.body;
  const { userId } = req.params;
  
  if (!["user", "admin", "psychologist"].includes(newRole)) {
    return res.status(400).json({ success: false, message: "Rol inválido" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({ success: true, message: "Rol actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar rol" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.status(200).json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar usuario" });
  }
};

export const getAllPsychologists = async (req, res) => {
  try {
    const psychologists = await User.find({ role: "psychologist" }).select("-password");
    res.status(200).json({ success: true, psychologists });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener psicólogos" });
  }
};

export const assignPsychologist = async (req, res) => {
  try {
    const { userId, psychologistId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    const newPsychologist = await User.findById(psychologistId);
    if (!newPsychologist || newPsychologist.role !== "psychologist") {
      return res.status(400).json({ success: false, message: "Psicólogo no válido." });
    }

    const oldPsychologistId = user.psychologistAssigned;
    user.psychologistAssigned = psychologistId;
    await user.save();

    const io = getIO();

    io.to(`psychologist-${psychologistId}`).emit("reassigned-user", {
      psychologistId,
      userId,
      message: `📢 Se te ha reasignado un nuevo paciente: ${user.name}`,
    });

    return res.status(200).json({ success: true, message: "Usuario reasignado correctamente." });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error en el servidor." });
  }
};

export const getPsychologistsWithAssignedUsers = async (req, res) => {
  try {
    const psychologists = await User.find({ role: "psychologist" })
      .populate("psychologistAssigned", "name last_name email")
      .select("name last_name email psychologistAssigned");

    const psychologistsWithUsers = await Promise.all(
      psychologists.map(async (psychologist) => {
        const assignedUsers = await User.find({ psychologistAssigned: psychologist._id })
          .select("name last_name email");

        return {
          _id: psychologist._id,
          name: psychologist.name,
          last_name: psychologist.last_name,
          email: psychologist.email,
          assignedUsers,
        };
      })
    );

    res.status(200).json({ success: true, psychologists: psychologistsWithUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
};

export const getAllPsychologistsWithPatients = async (req, res) => {
  try {
    const psychologists = await User.find({ role: "psychologist" })
      .select("-password")
      .lean();

    const psychologistsWithPatients = await Promise.all(
      psychologists.map(async (psych) => {
        const assignedUsers = await User.find({ psychologistAssigned: psych._id })
          .select("name last_name email");

        return {
          ...psych, 
          assignedUsers,
          assignedPatients: assignedUsers.length,
        };
      })
    );

    res.status(200).json({ success: true, psychologists: psychologistsWithPatients });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
};

export const reassignUsers = async (req, res) => {
  try {
    const { userIds, newPsychologistId } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: "Usuarios inválidos." });
    }

    const newPsychologist = await User.findById(newPsychologistId);
    if (!newPsychologist || newPsychologist.role !== "psychologist") {
      return res.status(400).json({ success: false, message: "Psicólogo no válido." });
    }

    await Promise.all(userIds.map(async (userId) => {
      await User.findByIdAndUpdate(userId, { psychologistAssigned: newPsychologistId });
    }));

    res.status(200).json({ success: true, message: "Usuarios reasignados correctamente." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
};


export const reassignAllPatients = async (req, res) => {
  try {
    const { fromPsychologist, toPsychologist } = req.body;

    if (!fromPsychologist || !toPsychologist || fromPsychologist === toPsychologist) {
      return res.status(400).json({ success: false, message: "Datos inválidos para reasignación." });
    }

    const patients = await User.find({ psychologistAssigned: fromPsychologist });

    await User.updateMany(
      { psychologistAssigned: fromPsychologist },
      { psychologistAssigned: toPsychologist }
    );

    res.status(200).json({ success: true, message: "Todos los pacientes han sido reasignados." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
};