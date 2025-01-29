import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_NEW_USER_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE } from "../Oauth_nodemailer/Oauth_templates.js"
import { transporter } from "../Oauth_nodemailer/Oauth2.nodemailer.config.js"


export const sendVerificationEmail = async ( email, verificationToken) => {
    try {
        const response = await transporter.sendMail({
            from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Verifica tu correo",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Verificación de correo"
        })
    }catch (error) {
        throw new Error ("Error al enviar el correo de verificación" ,error)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try{
        const response = await transporter.sendMail({
            from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Verificación de cuenta exitosa",
            html: WELCOME_NEW_USER_EMAIL_TEMPLATE.replace("{name}", name),
        })
    }catch(error){
        throw new Error("Error al enviar el correo de bienvenida", error)
    }
}

export const generateResetPasswordUrl = (resetToken) => {
    const clientUrl = process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL_DEV;
  
    return `${clientUrl}/recovery-password/${resetToken}`;
};
  

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
      const resetUrl = generateResetPasswordUrl(resetToken);
      const response = await transporter.sendMail({
        from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_USER}>`,
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
            from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Reestablecimiento de contraseña exitoso",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reestablecimiento de contraseña exitoso"
        })
    } catch (error) {
        throw new Error("Error al reestablecer la contraseña", error)
    }
}