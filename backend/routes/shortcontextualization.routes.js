import express from "express";
import { saveShortContextualizationAnswers, getShortContextualizationAnswers } from "../controllers/ShortContextualization.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { validatePackageAccess } from "../middleware/validatePackageAccess.js";
import { checkTestCompletion } from "../middleware/checkTestCompletion.js";

const router = express.Router();

router.post("/save-short-contextualization/:packageId", verifyToken, validatePackageAccess, saveShortContextualizationAnswers);
router.get("/load-short-contextualization/:packageId", verifyToken, validatePackageAccess, checkTestCompletion("shortContextualization"), getShortContextualizationAnswers);

export default router;
