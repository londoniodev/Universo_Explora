import nodemailer from "nodemailer"
import { google } from "googleapis"
import dotenv from 'dotenv'

dotenv.config();

const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

const getAccessToken = async () => {
    try {
        const { token } = await oauth2Client.getAccessToken()
        return token;
    } catch (error) {
        console.error('Error obteniendo el access token:', error)
        return null
    }
};

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.SMTP_EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: async () => getAccessToken(),
    },
    tls: {
        rejectUnauthorized: false
    },
});