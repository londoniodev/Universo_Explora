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
  console.log("🔍 Revisando usuario:", req.user);

  if (!req.user) {
    console.warn("isPsychologist - req.user no está definido");
    return res.status(403).json({ success: false, message: "Acceso denegado - Usuario no autenticado" });
  }

  if (req.user.role !== "psychologist" && req.user.role !== "fallback_psychologist") {
    console.warn("Acceso denegado para el usuario:", req.user);
    return res.status(403).json({ success: false, message: "Acceso denegado" });
  }

  console.log("✅ Usuario validado como psicólogo:", req.user);
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