import { User } from "../models/user.model.js";

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
 * 📩 Simula la confirmación de un psicólogo antes de aceptar un usuario.
 * En un sistema real, esto enviaría una notificación.
 */
const requestPsychologistConfirmation = async (psychologist) => {
  console.log(`📩 Enviando solicitud a ${psychologist.name} para aceptar usuario...`);
  
  // Simulación: el 50% de los psicólogos acepta
  return Math.random() > 0.5;
};

/**
 * 🔄 Asigna un psicólogo automáticamente a un usuario.
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

    console.log(`🔍 Buscando psicólogo disponible para usuario ${userId}...`);

    // 🔥 Buscar psicólogos con cupo disponible
    const availablePsychologists = await User.find({
      role: "psychologist",
      $expr: { $lt: [{ $size: { $ifNull: ["$assignedUsers", []] } }, MAX_USERS_PER_WEEK] },
    }).sort({ lastAssigned: 1 });

    // 🔄 Intentamos asignar el usuario a cada psicólogo disponible
    for (const psychologist of availablePsychologists) {
      const wantsToAccept = await requestPsychologistConfirmation(psychologist);

      if (wantsToAccept) {
        console.log(`✅ Psicólogo ${psychologist.name} aceptó al usuario.`);

        user.psychologistAssigned = {
          id: psychologist._id,
          name: psychologist.name,
          email: psychologist.email,
          specialization: psychologist.specialization || "General",
        };

        psychologist.assignedUsers = psychologist.assignedUsers || [];
        psychologist.assignedUsers.push(user._id);
        psychologist.lastAssigned = new Date();

        await user.save();
        await psychologist.save();

        return { success: true, psychologist: user.psychologistAssigned };
      }
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