import express from "express";
import { saveAnswers, getUserAnswers, getCalculatedResults, completeTest } from "../controllers/Sxiteenpfanswers.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { validatePackageAccess } from "../middleware/validatePackageAccess.js";
import { checkTestCompletion } from "../middleware/checkTestCompletion.js";

const router = express.Router();

router.post("/:packageId/save", verifyToken, validatePackageAccess, saveAnswers);
router.get("/:packageId", verifyToken, validatePackageAccess, checkTestCompletion("sixteenPF"), getUserAnswers);
router.get("/:packageId/results", verifyToken, validatePackageAccess, checkTestCompletion("sixteenPF"), getCalculatedResults);
router.post("/:packageId/complete-sixteenpf", verifyToken, validatePackageAccess, completeTest);

export default router;