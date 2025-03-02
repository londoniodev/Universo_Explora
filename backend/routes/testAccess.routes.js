import express from "express";
import { 
    createAccessToken, validateAccessToken, revokeAccessToken, validateAccessTokenForUser,
    generateAccessForUser, getPsychologistAccesses, getPsychologistPurchases
} from "../controllers/testAccess.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { isPsychologist } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas para todos los usuarios
router.post("/generate", verifyToken, createAccessToken);
router.post("/validate", verifyToken, validateAccessToken);
router.post("/revoke", verifyToken, revokeAccessToken);

// Rutas exclusivas para psicólogos
router.post("/generate-psychologist-access", verifyToken, isPsychologist, generateAccessForUser);
router.get("/psychologist-accesses", verifyToken, isPsychologist, getPsychologistAccesses);
router.get("/psychologist-purchases", verifyToken, isPsychologist, getPsychologistPurchases);
router.post("/validate-access-token", verifyToken, validateAccessTokenForUser);


export default router;