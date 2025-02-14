import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isPsychologist } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { psychologistDashboard, getPendingRequests, respondToRequest, handleAutoAssignment } from "../controllers/psychologist.controller.js";
import { registerPsychologist } from "../controllers/auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "degreeCertificate", maxCount: 1 },
    { name: "professionalCard", maxCount: 1 },
  ]),
  registerPsychologist
);
router.get("/dashboard", verifyToken, isPsychologist, psychologistDashboard);
router.get("/requests", verifyToken, isPsychologist, getPendingRequests);
router.post("/requests/respond", verifyToken, isPsychologist, respondToRequest);
router.post("/requests/assign-auto", verifyToken, isPsychologist, handleAutoAssignment);

export default router;