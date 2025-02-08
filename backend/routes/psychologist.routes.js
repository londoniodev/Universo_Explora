import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isPsychologist } from "../middleware/auth.middleware.js";
import { 
  psychologistDashboard, 
  assignPsychologistAutomatically, 
  getPendingRequests, 
  respondToRequest 
} from "../controllers/psychologist.controller.js";

const router = express.Router();

router.use(verifyToken);

// 📊 Dashboard del psicólogo
router.get("/dashboard", isPsychologist, psychologistDashboard);

// 📩 Obtener solicitudes pendientes de asignación
router.get("/pending-requests", isPsychologist, getPendingRequests);

// ✅ Psicólogo responde a la solicitud de asignación
router.post("/respond-request", isPsychologist, respondToRequest);

// 🔄 Asignación automática de psicólogos con manejo de errores
router.post("/assign-auto", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Falta el userId en la solicitud" });
    }
    const result = await assignPsychologistAutomatically(userId);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("❌ Error en /assign-auto:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;