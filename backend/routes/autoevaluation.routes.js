import express from "express";
import { saveAutoevaluation, loadAutoevaluation, completeTest, getcalculateAutoevaluationResults } from "../controllers/Autoevaluation.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { validatePackageAccess } from "../middleware/validatePackageAccess.js";
import { checkTestCompletion } from "../middleware/checkTestCompletion.js";

const router = express.Router();

router.post("/:packageId/save-autoevaluation", verifyToken, validatePackageAccess, saveAutoevaluation);
router.get("/:packageId/load-autoevaluation/:userId", verifyToken, validatePackageAccess, checkTestCompletion("autoevaluation"), loadAutoevaluation);
router.post("/:packageId/complete-autoevaluation", verifyToken, validatePackageAccess, completeTest);
router.get("/",verifyToken, getcalculateAutoevaluationResults);

export default router;