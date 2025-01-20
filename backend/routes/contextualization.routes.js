import express from "express";
import { saveContextualizationAnswers, getContextualizationAnswers, completeTest } from "../controllers/Contextualization.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { validatePackageAccess } from "../middleware/validatePackageAccess.js";
import { checkTestCompletion } from "../middleware/checkTestCompletion.js";

const router = express.Router();

router.post("/:packageId/save-contextualization", verifyToken, validatePackageAccess, saveContextualizationAnswers);
router.get("/:packageId/load-contextualization", verifyToken, validatePackageAccess, checkTestCompletion("contextualization"), getContextualizationAnswers);
router.post("/:packageId/complete-contextualization", verifyToken, validatePackageAccess, completeTest);

export default router;
