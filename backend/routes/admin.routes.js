import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/admin.controller.js";
import { getAllPsychologists } from "../controllers/admin.controller.js";
const router = express.Router();

router.use(verifyToken);

router.get("/users", isAdmin, getAllUsers);
router.put("/users/:userId/role", isAdmin, updateUserRole);
router.delete("/users/:userId", isAdmin, deleteUser);
router.get("/psychologists", isAdmin, getAllPsychologists);

export default router;
