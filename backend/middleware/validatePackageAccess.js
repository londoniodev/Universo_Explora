import { UserPackageAccess } from "../models/UserPackageAccess.model.js";

export const validatePackageAccess = async (req, res, next) => {
  try {
    const { packageId } = req.params;

    if (!packageId) {
      return next();
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado. No puedes acceder al paquete.",
      });
    }

    const access = await UserPackageAccess.findOne({
      $or: [{ userId: req.user._id }, { usedBy: req.user._id }],
      packageId,
      isActive: true,
    });

    if (!access) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. No tienes permiso para este paquete.",
      });
    }

    req.accessDetails = access;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al validar el acceso al paquete.",
      error: error.message,
    });
  }
};