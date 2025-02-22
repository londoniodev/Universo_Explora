import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import { getAllUsers, updateUserRole, deleteUser, getAllPsychologistsWithPatients,
    reassignAllPatients, reassignUsers, getPendingPsychologists, approvePsychologist, rejectPsychologist,
    getAllPsychologists, assignPsychologist, getPsychologistsWithAssignedUsers } from "../controllers/admin.controller.js";
const router = express.Router();

router.use(verifyToken);

router.get("/users", isAdmin, getAllUsers);
router.post("/reassign-users", isAdmin, reassignUsers);

router.put("/users/:userId/role", isAdmin, updateUserRole);
router.delete("/users/:userId", isAdmin, deleteUser);

router.get("/psychologists", isAdmin, getAllPsychologists);
router.post("/assign-psychologist", isAdmin, assignPsychologist);
router.post("/reassign-all-patients", isAdmin, reassignAllPatients);

router.get("/pending-psychologists", isAdmin, getPendingPsychologists);
router.patch("/approve-psychologist/:userId", isAdmin, approvePsychologist);
router.post("/reject-psychologist", isAdmin, rejectPsychologist);

router.get("/psychologists-with-patients", isAdmin, getAllPsychologistsWithPatients);
router.get("/psychologists/assigned-users", isAdmin, getPsychologistsWithAssignedUsers);

export default router;
