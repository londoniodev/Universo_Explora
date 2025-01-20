import express from "express";
import { assignPsychologist } from "../controllers/psychologistAssign.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdminOrPsychologist } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);
router.post("/assign", verifyToken, isAdminOrPsychologist, assignPsychologist);

export default router;
