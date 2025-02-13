import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isPsychologist } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js"; // Middleware para archivos
import { psychologistDashboard, getPendingRequests, respondToRequest, handleAutoAssignment } from "../controllers/psychologist.controller.js";
import { registerPsychologist } from "../controllers/auth.controller.js";

const router = express.Router();

// ✅ Registro de psicólogos con archivos adjuntos (SIN requerir autenticación)
router.post(
  "/register",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "degreeCertificate", maxCount: 1 },
    { name: "professionalCard", maxCount: 1 },
  ]),
  verifyToken, isPsychologist, registerPsychologist );

// 📊 Dashboard del psicólogo
router.get("/dashboard", verifyToken, isPsychologist, psychologistDashboard);

// 📩 Obtener solicitudes pendientes de asignación
router.get("/requests", verifyToken, isPsychologist, getPendingRequests);

// ✅ Psicólogo responde a la solicitud de asignación
router.post("/requests/respond", verifyToken, isPsychologist, respondToRequest);

// 🔄 Asignación automática de psicólogos
router.post("/requests/assign-auto", verifyToken, isPsychologist, handleAutoAssignment);

export default router;