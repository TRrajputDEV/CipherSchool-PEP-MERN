import express from "express";
import {
  createConfession,
  getAllConfessions,
  updateConfession,
  deleteConfession,
  reactToConfession,
} from "../controllers/confession.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public — anyone can view confessions
router.get("/", getAllConfessions);

// Protected — must be logged in via Google
router.post("/", isAuthenticated, createConfession);
router.put("/:id", isAuthenticated, updateConfession);
router.delete("/:id", isAuthenticated, deleteConfession);
router.post("/:id/react", isAuthenticated, reactToConfession);

export default router;