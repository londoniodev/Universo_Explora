import { UserPackageAccess } from "../models/UserPackageAccess.model.js";

export const validatePackageAccess = async (req, res, next) => {
  try {
   
    const { packageId } = req.params;
    const userId = req.userId;

    if (!packageId) {
      return next();
    }

    const access = await UserPackageAccess.findOne({
      userId,
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