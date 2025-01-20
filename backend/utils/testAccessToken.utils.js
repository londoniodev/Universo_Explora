import jwt from "jsonwebtoken";

const secretKey = process.env.TEST_ACCESS_SECRET || "fallback_secret_key";
const defaultExpiration = process.env.TEST_ACCESS_TOKEN_EXPIRATION || "7d";

export const generateTestAccessToken = (payload, expiration = defaultExpiration) => {
  const options = expiration ? { expiresIn: expiration } : {};
  return jwt.sign(payload, secretKey, options);
};

export const verifyTestAccessToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};