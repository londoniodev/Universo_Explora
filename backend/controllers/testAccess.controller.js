import { UserPackageAccess } from "../models/UserPackageAccess.model.js";
import { generateTestAccessToken, verifyTestAccessToken } from "../utils/testAccessToken.utils.js";

export const createAccessToken = async (req, res) => {
  const { userId, packageId, expiration } = req.body;

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