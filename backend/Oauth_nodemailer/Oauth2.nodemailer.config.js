import nodemailer from "nodemailer"
// import { google } from "googleapis"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import crypto from 'crypto'
import { VERIFICATION_EMAIL_TEMPLATE } from "../Oauth_nodemailer/Oauth_templates.js"

dotenv.config();

// const OAuth2 = google.auth.OAuth2

// const oauth2Client = new OAuth2(
//     process.env.OAUTH_CLIENT_ID,
//     process.env.OAUTH_CLIENT_SECRET,
//     "https://developers.google.com/oauthplayground"
// );

// oauth2Client.setCredentials({
//     refresh_token: process.env.OAUTH_REFRESH_TOKEN,
// });

// const getAccessToken = async () => {
//     try {
//         const { token } = await oauth2Client.getAccessToken()
//         return token;
//     } catch (error) {
//         console.error('Error obteniendo el access token:', error)
//         return null
//     }
// };

export const transporter = nodemailer.createTransport({
    // service: 'gmail',
    // auth: {
    //     type: 'OAuth2',
    //     user: process.env.SMTP_EMAIL,
    //     clientId: process.env.OAUTH_CLIENT_ID,
    //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
    //     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    //     accessToken: async () => getAccessToken(),
    // },
    // tls: {
    //     rejectUnauthorized: false
    // },
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    secure: process.env.SMTP_SECURE === 'true',
    tls: {
        rejectUnauthorized: false
    }
});


export const sendVerificationEmail = async (email,userId) => {
    const verificationToken = crypto.randomInt(100000,999999).toString()
    const verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId format')
    }

    const objectId = new mongoose.Types.ObjectId(userId)
    await User.findByIdAndUpdate(objectId, { verificationToken, verificationTokenExpiresAt })

    const mailOptions = {
        from: `"Explora Support - NoReply (No Responder)" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verificación de correo electrónico",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    };
    transporter.sendMail(mailOptions)
}