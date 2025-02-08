import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No se proporcionó token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token inválido o expirado" });
  }
};

export const isPsychologist = (req, res, next) => {
  if (req.user?.role !== "psychologist") {
    return res.status(403).json({ success: false, message: "Acceso denegado" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Acceso denegado: Se requiere rol de administrador" });
  }
  next();
};

export const isAdminOrPsychologist = (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.role === "psychologist") {
    return next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado: Se requiere rol de administrador o psicólogo",
    });
  }
};