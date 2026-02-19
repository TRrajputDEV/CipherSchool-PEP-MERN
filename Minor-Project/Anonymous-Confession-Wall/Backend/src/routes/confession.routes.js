import express from "express";
import {
  createConfession,
  getAllConfessions,
  updateConfession,
  deleteConfession,
  reactToConfession,
  getPredefinedTags,
} from "../controllers/confession.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllConfessions);
router.get("/tags/predefined", getPredefinedTags);

// Protected
router.post("/", isAuthenticated, createConfession);
router.put("/:id", isAuthenticated, updateConfession);
router.delete("/:id", isAuthenticated, deleteConfession);
router.post("/:id/react", isAuthenticated, reactToConfession);

export default router;