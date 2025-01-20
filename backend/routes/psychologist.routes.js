import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { psychologistDashboard } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/dashboard", verifyToken, psychologistDashboard);

export default router;
