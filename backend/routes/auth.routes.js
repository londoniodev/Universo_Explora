import express from "express";
import { login, logout, signup, verifyCode, forgotPassword,
  recoveryPassword, checkAuth, getAccountInfo, updateAccountInfo,
  markResultsAsSent, getPsychologistAccountInfo, updatePsychologistAccountInfo } from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.middleware.js"; 
import { isPsychologist } from "../middleware/auth.middleware.js";

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

router.get("/psychologist/my-account", verifyToken, isPsychologist, getPsychologistAccountInfo);
router.put(
    "/psychologist/my-account",
    verifyToken,
    upload.fields([
      { name: "profilePicture", maxCount: 1 },
      { name: "degreeCertificate", maxCount: 1 },
      { name: "professionalCard", maxCount: 1 },
    ]), updatePsychologistAccountInfo);  

router.post("/mark-results-as-sent", verifyToken, markResultsAsSent);

export default router;