import express from "express";
import { getMyProfile, updateMyProfile, getMyConfessions } from "../controllers/User.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected Routes for the logged-in agent
router.get("/me", isAuthenticated, getMyProfile);
router.put("/me", isAuthenticated, updateMyProfile);
router.get("/me/confessions", isAuthenticated, getMyConfessions);

export default router;