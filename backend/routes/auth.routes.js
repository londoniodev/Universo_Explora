import express from "express"
import { login, logout, signup, verifyCode, forgotPassword, recoveryPassword, checkAuth, psychologistDashboard, manageUsers, getAccountInfo, updateAccountInfo, markResultsAsSent  } from "../controllers/auth.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { isPsychologist } from "../middleware/auth.middleware.js"
import { validateTestAccess } from "../middleware/validateTestAccess.js";
const router = express.Router()


router.post("/logout", logout)

router.post("/signup", signup);
router.post("/verify-code", verifyCode);
router.post("/login", login);

router.get("/check-auth", verifyToken, checkAuth);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/recovery-password/:token", recoveryPassword);

router.get("/dashboard/package/:packageId/:testType",verifyToken, validateTestAccess, (req, res) => {
    res.status(200).json({ success: true, message: "Acceso permitido al test." });
})

router.get("/psychologist-dashboard", verifyToken, isPsychologist, psychologistDashboard);
router.get("/manage-users", verifyToken, isPsychologist, manageUsers);

router.get("/my-account", verifyToken, getAccountInfo);
router.put("/my-account", verifyToken, updateAccountInfo);

router.post("/mark-results-as-sent", verifyToken, markResultsAsSent);

export default router
    