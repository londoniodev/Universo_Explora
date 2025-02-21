import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import { getAllUsers, updateUserRole, deleteUser,
    getAllPsychologists, assignPsychologist, getPsychologistsWithAssignedUsers } from "../controllers/admin.controller.js";
const router = express.Router();

router.use(verifyToken);

router.get("/users", isAdmin, getAllUsers);
router.put("/users/:userId/role", isAdmin, updateUserRole);
router.delete("/users/:userId", isAdmin, deleteUser);
router.get("/psychologists", isAdmin, getAllPsychologists);
router.post("/assign-psychologist", isAdmin, assignPsychologist);
router.get("/psychologists/assigned-users", isAdmin, getPsychologistsWithAssignedUsers);

export default router;
