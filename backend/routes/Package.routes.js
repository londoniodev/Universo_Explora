import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { validatePackageAccess } from "../middleware/validatePackageAccess.js";
import { getPackageDetails, accessPackageContent } from "../controllers/package.controller.js";

const router = express.Router();

router.get("/:packageId", verifyToken, validatePackageAccess, getPackageDetails);
router.get("/:packageId/content", verifyToken, validatePackageAccess, accessPackageContent);

export default router;