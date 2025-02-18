import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  let token = req.cookies?.token || null;

  if (!token && req.headers.authorization) {
    const authHeaderParts = req.headers.authorization.split(" ");
    if (authHeaderParts.length === 2 && authHeaderParts[0] === "Bearer") {
      token = authHeaderParts[1];
    }
  }

  if (!token) {
    console.warn("❌ verifyToken - Token no proporcionado");
    return res.status(401).json({ success: false, message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      console.warn("❌ verifyToken - Usuario no encontrado");
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ verifyToken - Token inválido o expirado:", error.message);
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};