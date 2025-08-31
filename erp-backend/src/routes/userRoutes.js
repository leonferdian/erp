import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only logged-in users can view users
router.get("/", protect, getUsers);

// Only admin can create users
router.post("/", protect, authorizeRoles("admin"), createUser);

export default router;
