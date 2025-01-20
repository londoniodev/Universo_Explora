import { User } from "../models/user.model.js";

export const assignPsychologist = async (req, res) => {
  const { userId, psychologistId } = req.body;

  try {
    const user = await User.findById(userId);
    const psychologist = await User.findById(psychologistId);

    if (!user || !psychologist) {
      return res.status(404).json({ success: false, message: "Usuario o psicólogo no encontrado" });
    }

    if (psychologist.role !== "psychologist") {
      return res.status(400).json({ success: false, message: "El usuario asignado no es un psicólogo válido" });
    }

    user.psychologistAssigned = {
      id: psychologist._id,
      name: psychologist.name,
      email: psychologist.email,
      specialization: psychologist.specialization || "General",
    };

    await user.save();

    res.status(200).json({ success: true, message: "Psicólogo asignado", psychologist: user.psychologistAssigned });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al asignar psicólogo" });
  }
};
