import express from "express";
import { login, logout, signup, verifyCode, forgotPassword, recoveryPassword, checkAuth, getAccountInfo, updateAccountInfo, markResultsAsSent } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/logout", logout);
router.post("/signup", signup);
router.post("/verify-code", verifyCode);
router.post("/login", login);

router.get("/check-auth", verifyToken, checkAuth);
router.post("/forgot-password", forgotPassword);
router.post("/recovery-password/:token", recoveryPassword);

router.get("/my-account", verifyToken, getAccountInfo);
router.put("/my-account", verifyToken, updateAccountInfo);

router.post("/mark-results-as-sent", verifyToken, markResultsAsSent);

export default router;