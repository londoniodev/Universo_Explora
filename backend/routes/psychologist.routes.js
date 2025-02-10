import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isPsychologist } from "../middleware/auth.middleware.js";
import { 
  psychologistDashboard, 
  getPendingRequests, 
  respondToRequest, 
  handleAutoAssignment 
} from "../controllers/psychologist.controller.js";

const router = express.Router();

// ✅ Aplicar `verifyToken` a todas las rutas
router.use(verifyToken);
router.use(isPsychologist); // 🔥 Se aplica a todas las rutas de psicólogos

// 📊 Dashboard del psicólogo
router.get("/dashboard", psychologistDashboard); // Se cambió la ruta para evitar conflicto con `/requests`

// 📩 Obtener solicitudes pendientes de asignación
router.get("/requests", getPendingRequests); // ✅ Ruta corregida

// ✅ Psicólogo responde a la solicitud de asignación
router.post("/requests/respond", respondToRequest); // ✅ Ruta corregida

// 🔄 Asignación automática de psicólogos
router.post("/requests/assign-auto", handleAutoAssignment);

export default router;