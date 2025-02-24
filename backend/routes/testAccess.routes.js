import express from "express";
import { 
    createAccessToken, validateAccessToken, getPsychologistPurchases,
    revokeAccessToken, generateAccessForUser, getPsychologistAccesses
} from "../controllers/testAccess.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { isPsychologist } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", verifyToken, createAccessToken);
router.post("/validate", verifyToken, validateAccessToken);
router.post("/revoke", verifyToken, revokeAccessToken);
router.post("/generate", verifyToken, isPsychologist, generateAccessForUser);
router.get("/psychologist-accesses", verifyToken, getPsychologistAccesses);
router.get("/psychologist-purchases", verifyToken, getPsychologistPurchases);

export default router;
