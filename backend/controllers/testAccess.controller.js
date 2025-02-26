import { UserPackageAccess } from "../models/UserPackageAccess.model.js";
import { generateTestAccessToken, verifyTestAccessToken } from "../utils/testAccessToken.utils.js";
export const createAccessToken = async (req, res) => {
  const { packageId, expiration } = req.body;
  const userId = req.userId;

  if (!userId || !packageId) {
    return res.status(400).json({ success: false, message: "userId y packageId son requeridos." });
  }

  try {
    const token = generateTestAccessToken({ userId, packageId }, expiration || 604800);
    const expiresAt = expiration ? new Date(Date.now() + expiration * 1000) : null;

    const newAccess = await UserPackageAccess.create({
      token,
      userId,
      packageId,
      expiresAt,
    });

    res.status(201).json({ success: true, access: newAccess });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear el token." });
  }
};

export const validateAccessToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token es requerido." });
  }

  try {
    const decoded = verifyTestAccessToken(token);

    const access = await UserPackageAccess.findOne({ token });
    if (!access) {
      return res.status(404).json({ success: false, message: "Token no encontrado." });
    }

    if (access.isRevoked) {
      return res.status(400).json({ success: false, message: "Token revocado." });
    }

    if (access.expiresAt && new Date() > access.expiresAt) {
      return res.status(400).json({ success: false, message: "Token expirado." });
    }

    res.status(200).json({ success: true, message: "Token válido.", data: decoded });
  } catch (error) {
    res.status(400).json({ success: false, message: "Token inválido o expirado" });
  }
};

export const revokeAccessToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token es requerido." });
  }

  try {
    const access = await UserPackageAccess.findOneAndUpdate(
      { token },
      { isRevoked: true },
      { new: true }
    );

    if (!access) {
      return res.status(404).json({ success: false, message: "Token no encontrado." });
    }

    res.status(200).json({ success: true, message: "Token revocado con éxito." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al revocar el token." });
  }
};

/**
 * Genera un acceso para un usuario desde el saldo del psicólogo.
 */
export const generateAccessForUser = async (req, res) => {
  try {
    const psychologistId = req.userId;
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({ success: false, message: "El packageId es requerido." });
    }

    const psychologist = await User.findById(psychologistId);

    if (!psychologist || (psychologist.role !== "psychologist" && psychologist.role !== "fallback_psychologist")) {
      return res.status(403).json({ success: false, message: "Acción no permitida." });
    }

    if (psychologist.accessBalance <= 0) {
      return res.status(400).json({ success: false, message: "No tienes accesos disponibles." });
    }

    // Generar token de acceso válido por 30 días
    const token = generateTestAccessToken({ psychologistId, packageId }, "30d");

    // Guardar el token en UserPackageAccess
    const newAccess = await UserPackageAccess.create({
      token,
      userId: psychologistId, // El psicólogo es quien lo generó
      packageId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    });

    // Descontar el acceso del saldo del psicólogo
    psychologist.accessBalance -= 1;
    await psychologist.save();

    return res.status(201).json({
      success: true,
      message: "Acceso generado con éxito.",
      accessToken: token,
      remainingAccesses: psychologist.accessBalance,
    });

  } catch (error) {
    console.error("Error al generar el acceso:", error);
    return res.status(500).json({ success: false, message: "Error al generar el acceso." });
  }
};

/**
 * Obtiene la lista de accesos generados por el psicólogo.
 */
export const getPsychologistAccesses = async (req, res) => {
  try {
    const psychologistId = req.userId;

    const accesses = await UserPackageAccess.find({ userId: psychologistId });

    return res.status(200).json({ success: true, accesses });
  } catch (error) {
    console.error("Error al obtener los accesos:", error);
    return res.status(500).json({ success: false, message: "Error al obtener los accesos" });
  }
};

/**
 * Obtiene el historial de compras del psicólogo y su saldo de accesos.
*/

export const getPsychologistPurchases = async (req, res) => {
  try {
    const psychologistId = req.userId;

    const purchases = await UserPackageAccess.find({ userId: psychologistId, paymentStatus: "completed" });

    const accessBalance = purchases.length;

    return res.status(200).json({ success: true, accessBalance, purchases });
  } catch (error) {
    console.error("Error al obtener las compras:", error);
    return res.status(500).json({ success: false, message: "Error al obtener las compras" });
  }
};