import express from "express";
import { getQuestions } from "../controllers/Sixteenpfquestions.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { validatePackageAccess } from "../middleware/validatePackageAccess.js";

const router = express.Router();

router.get("/:packageId/:userId", verifyToken, validatePackageAccess, getQuestions);

export default router;