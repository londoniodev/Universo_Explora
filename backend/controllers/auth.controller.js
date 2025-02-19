import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../Oauth_nodemailer/Oauth2.nodemailer.config.js";
import { sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../Oauth_nodemailer/Oauth.Emails.js";
import { User } from "../models/user.model.js";
import { Psychologist } from "../models/psychologist.model.js";
import cloudinary from "../config/cloudinary.config.js";

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
  const { name, last_name, birthdate, phone, city, gender, customGender, email, password, role } = req.body;

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

    const newUser = {
      name,
      last_name,
      birthdate,
      phone,
      city,
      gender: gender === "custom" ? customGender : gender,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      role: role || "user",
    };

    if (role === "psychologist") {
      newUser.documentId = req.body.documentId || "";
      newUser.experienceYears = req.body.experienceYears || 0;
      newUser.profilePicture = req.body.profilePicture || "";
      newUser.degreeCertificate = req.body.degreeCertificate || "";
      newUser.professionalCard = req.body.professionalCard || "";
    }
    
    const user = new User(newUser);
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

    const yearsOfExperience = parseInt(experienceYears, 10);

    if (!name || !last_name || !birthdate || !phone || !city || !gender || !email || !password || !idCardNumber) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
    }

    const profilePicture = req.files["profilePicture"]?.[0]?.filename || "";
    const degreeCertificate = req.files["degreeCertificate"]?.[0]?.filename || "";
    const professionalCard = req.files["professionalCard"]?.[0]?.filename || "";


    if (!profilePicture || !degreeCertificate) {
      return res.status(400).json({ success: false, message: "Debe subir la foto de perfil y el acta de grado." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Este correo ya está registrado." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      name,
      last_name,
      birthdate,
      phone,
      city,
      gender,
      email,
      password: hashedPassword,
      role: "psychologist",
      documentId: idCardNumber,
      experienceYears: yearsOfExperience,
      profilePicture,
      degreeCertificate,
      professionalCard,
      isApproved: false,
    });

    await user.save();

    const psychologist = new Psychologist({
      userId: user._id,
      isApproved: false,
    });

    await psychologist.save();

    res.status(201).json({
      success: true,
      message: "Registro exitoso. Esperando aprobación del administrador.",
    });

  } catch (error) {
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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Credenciales incorrectas" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Credenciales incorrectas" });
    }

    let psychologist = null;
    if (user.role === "psychologist") {
      psychologist = await Psychologist.findOne({ userId: user._id });

      if (!psychologist) {
        psychologist = await Psychologist.findOne({ email: user.email });
        if (!psychologist) {
          return res.status(400).json({
            success: false,
            message: "No se encontró el perfil de psicólogo asociado a este usuario.",
          });
        }
      }

      if (psychologist.isApproved && !user.isVerified) {
        await User.findByIdAndUpdate(user._id, { isVerified: true }, { new: true });
        user.isVerified = true;
      }

      if (!psychologist.isApproved) {
        return res.status(403).json({ success: false });
      }
    }

    setTokenCookie(res, user._id.toString());

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isApproved: psychologist ? psychologist.isApproved : true,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error al iniciar sesión" });
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


//---------------------------------------------
// GET AND UPDATE PSYCHOLOGIST ACCOUNT INFO
//---------------------------------------------

export const getPsychologistAccountInfo = async (req, res) => {
  try {
    const psychologist = await User.findById(req.userId).select("-password");

    if (!psychologist || psychologist.role !== "psychologist") {
      return res.status(404).json({ success: false, message: "Psicólogo no encontrado" });
    }

    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

    psychologist.profilePicture = psychologist.profilePicture
      ? `${baseUrl}/uploads/psychologists/${psychologist.profilePicture}`
      : null;

    psychologist.degreeCertificate = psychologist.degreeCertificate
      ? `${baseUrl}/uploads/psychologists/${psychologist.degreeCertificate}`
      : null;

    psychologist.professionalCard = psychologist.professionalCard
      ? `${baseUrl}/uploads/psychologists/${psychologist.professionalCard}`
      : null;

    return res.status(200).json({ success: true, psychologist });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

// ---------------------------------------------
// UPDATE PSYCHOLOGIST ACCOUNT INFO USING CLOUDINARY
// ---------------------------------------------
export const updatePsychologistAccountInfo = async (req, res) => {
  try {
    const psychologist = await User.findById(req.userId);

    if (!psychologist || psychologist.role !== "psychologist") {
      return res.status(404).json({ success: false, message: "Psicólogo no encontrado" });
    }

    const updates = ["name", "last_name", "phone", "city", "gender", "documentId", "experienceYears"];
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        psychologist[field] = req.body[field];
      }
    });

    const uploadToCloudinary = async (file, folder, oldUrl) => {
      if (oldUrl) {
        const oldPublicId = oldUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`psychologists/${oldPublicId}`);
      }
      const result = await cloudinary.uploader.upload(file.path, { folder: `psychologists` });
      return result.secure_url;
    };

    if (req.files?.profilePicture) {
      psychologist.profilePicture = await uploadToCloudinary(req.files.profilePicture[0], "psychologists", psychologist.profilePicture);
    }
    if (req.files?.degreeCertificate) {
      psychologist.degreeCertificate = await uploadToCloudinary(req.files.degreeCertificate[0], "psychologists", psychologist.degreeCertificate);
    }
    if (req.files?.professionalCard) {
      psychologist.professionalCard = await uploadToCloudinary(req.files.professionalCard[0], "psychologists", psychologist.professionalCard);
    }

    await psychologist.save();

    return res.status(200).json({
      success: true,
      message: "Información actualizada correctamente",
      psychologist,
    });

  } catch (error) {
    console.error("Error actualizando psicólogo:", error);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

// ---------------------------------------------
//  MARK RESULTS AS SENT
// ---------------------------------------------
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