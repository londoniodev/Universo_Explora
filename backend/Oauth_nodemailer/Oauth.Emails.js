import { 
    PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_NEW_USER_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE, APPROVAL_EMAIL_TEMPLATE, REJECTION_EMAIL_TEMPLATE
} from "../Oauth_nodemailer/Oauth_templates.js"
import { transporter } from "../Oauth_nodemailer/Oauth2.nodemailer.config.js"
import crypto from 'crypto'
import { User } from "../models/user.model.js"
import mongoose from "mongoose"

export const sendVerificationEmail = async (email,userId) => {
    const verificationToken = crypto.randomInt(100000,999999).toString()
    const verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format')
    }

    const objectId = new mongoose.Types.ObjectId(userId)
    await User.findByIdAndUpdate(objectId, { verificationToken, verificationTokenExpiresAt })

    const mailOptions = {
        from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "Verificación de correo electrónico",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    };
    transporter.sendMail(mailOptions);
}

export const sendWelcomeEmail = async (email, name) => {
    try{
        const response = await transporter.sendMail({
            from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Verificación de cuenta exitosa",
            html: WELCOME_NEW_USER_EMAIL_TEMPLATE.replace("{name}", name),
        })
    }catch(error){
        throw new Error("Error al enviar el correo de bienvenida", error)
    }
}

export const generateResetPasswordUrl = (resetToken) => {
    const clientUrl = process.env.CLIENT_URL_DEV === "production"
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL_DEV;
  
    return `${clientUrl}/recovery-password/${resetToken}`;
};
  

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
      const resetUrl = generateResetPasswordUrl(resetToken);
      const response = await transporter.sendMail({
        from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "Reestablece tu contraseña",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetUrl}", resetUrl),
        category: "Reestablecimiento de contraseña",
      });
    } catch (error) {
      throw new Error("Error al enviar el correo de reestablecimiento de contraseña", error);
    }
};  

export const sendResetSuccessEmail = async (email) => {
    try {
        const response = await transporter.sendMail({
            from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Reestablecimiento de contraseña exitoso",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reestablecimiento de contraseña exitoso"
        })
    } catch (error) {
        throw new Error("Error al reestablecer la contraseña", error)
    }
}

export const sendApprovalEmail = async (userId) => {
    try {
        const user = await User.findById(userId).select("email name last_name");
        if (!user) throw new Error("Usuario no encontrado.");

        const mailOptions = {
            from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_EMAIL}>`,
            to: user.email,
            subject: "Tu cuenta ha sido aprobada ✅",
            html: APPROVAL_EMAIL_TEMPLATE.replace("{name}", user.name).replace("{last_name}", user.last_name),
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("❌ Error al enviar email de aprobación:", error);
    }
}

export const sendRejectionEmail = async (email, name, reason) => {
    try {
        if (!email) throw new Error("Correo electrónico no proporcionado.");

        const mailOptions = {
            from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Tu solicitud ha sido rechazada ❌",
            html: REJECTION_EMAIL_TEMPLATE
                .replace("{name}", name)
                .replace("{reason}", reason),
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar email de rechazo:", error);
    }
};