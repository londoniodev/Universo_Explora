import express from "express";
import { createAccessToken, validateAccessToken, revokeAccessToken } from "../controllers/testAccess.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/generate", verifyToken, createAccessToken);
router.post("/validate", verifyToken, validateAccessToken);
router.post("/revoke", verifyToken, revokeAccessToken);

export default router;
