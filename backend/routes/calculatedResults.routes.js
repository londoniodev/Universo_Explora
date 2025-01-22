import express from "express";
import { getCalculatedResults } from "../controllers/Sxiteenpfanswers.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getCalculatedResults);

export default router;