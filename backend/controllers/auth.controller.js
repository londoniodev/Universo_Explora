import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../Oauth_nodemailer/Oauth2.nodemailer.config.js";
import { sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../Oauth_nodemailer/Oauth.Emails.js";
import { User } from "../models/user.model.js";

const setTokenCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "lax" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


export const signup = async (req, res) => {
  const { name, last_name, birthdate, phone, city, gender, customGender, email, password } = req.body;

  try {
    if (!email || !password || !name || !last_name || !birthdate || !phone || !city || !gender) {
      return res.status(400).json({ success: false, message: "Rellene todos los campos" });
    }

    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res.status(400).json({ success: false, message: "Este usuario ya existe" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({
      name,
      last_name,
      birthdate,
      phone,
      city,
      gender : gender === "custom" ? customGender : gender,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    await sendVerificationEmail(user.email, user.id.toString());

    setTokenCookie(res, user._id.toString());

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente. Por favor, verifica tu correo.",
      user: {
        ...user._doc,
        password: undefined,
        verificationToken: undefined,
        verificationTokenExpiresAt: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

export const registerPsychologist = async (req, res) => {
  try {
    const { name, last_name, birthdate, phone, city, gender, email, password, experienceYears, idCardNumber } = req.body;

    // ✅ Validar campos requeridos
    if (!name || !last_name || !birthdate || !phone || !city || !gender || !email || !password || !idCardNumber) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
    }

    // ✅ Validar archivos subidos (documentos)
    if (!req.files || !req.files.profilePicture || !req.files.degreeCertificate) {
      return res.status(400).json({ success: false, message: "Debe subir la foto de perfil y el acta de grado." });
    }

    // ✅ Verificar si el email ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "El usuario ya está registrado." });
    }

    // ✅ Hashear la contraseña
    const hashedPassword = await bcryptjs.hash(password, 10);

    // ✅ Crear nuevo psicólogo (pendiente de aprobación)
    const psychologist = new User({
      name,
      last_name,
      birthdate,
      phone,
      city,
      gender,
      email,
      password: hashedPassword,
      role: "psychologist",
      experienceYears,
      idCardNumber,
      profilePicture: req.files.profilePicture[0].path, // 📂 Ruta de la foto de perfil
      degreeCertificate: req.files.degreeCertificate[0].path, // 📂 Ruta del acta de grado
      isApproved: false, // 🔹 El admin debe aprobarlo manualmente
    });

    await psychologist.save();

    // ✅ Enviar correo de verificación
    await sendVerificationEmail(psychologist.email, psychologist._id.toString());

    res.status(201).json({
      success: true,
      message: "Registro exitoso. Esperando aprobación del administrador.",
    });
  } catch (error) {
    console.error("❌ Error en el registro de psicólogos:", error);
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
};

export const verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Código expirado o inválido" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "Cuenta verificada con éxito",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    setTokenCookie(res, user._id.toString());

    res.status(200).json({ message: "Inicio de sesión exitoso", user });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Sesión cerrada" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Usuario no encontrado" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({ success: true, message: "Correo enviado para restablecer la contraseña" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const recoveryPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Token inválido o expirado" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    return res.status(200).json({ success: true, message: "Contraseña restablecida con éxito" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ success: false, message: "No autorizado" });
  }
};

export const psychologistDashboard = async (req, res) => {
  return res.status(200).json({ success: true, message: "Dashboard del psicólogo" });
};

export const manageUsers = async (req, res) => {
  return res.status(200).json({ success: true, message: "Gestión de usuarios" });
};

export const getAccountInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

export const updateAccountInfo = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json({ success: true, message: "Información actualizada", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

export const markResultsAsSent = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    user.resultsSent = true;
    await user.save();

    return res.status(200).json({ success: true, message: "Resultados marcados como enviados." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor." });
  }
};