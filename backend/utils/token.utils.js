import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const isProduction = process.env.NODE_ENV === "production";
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  });  
};
