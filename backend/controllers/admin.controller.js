import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener usuarios" });
  }
};

export const updateUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

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
