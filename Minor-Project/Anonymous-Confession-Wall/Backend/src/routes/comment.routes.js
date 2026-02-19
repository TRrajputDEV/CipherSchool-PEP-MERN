import express from "express";
import {
  createConfession,
  getAllConfessions,
  updateConfession,
  deleteConfession,
  reactToConfession,
  getPredefinedTags,
} from "../controllers/confession.controller.js";

// IMPORT THE COMMENT CONTROLLERS
import {
  getComments,
  addComment,
} from "../controllers/comment.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// ── Public Routes ──
router.get("/", getAllConfessions);
router.get("/tags/predefined", getPredefinedTags);

// GET /api/confessions/:id/comments (Anyone can read notes)
router.get("/:id/comments", getComments); 

// ── Protected Routes (Requires Auth) ──
router.post("/", isAuthenticated, createConfession);
router.put("/:id", isAuthenticated, updateConfession);
router.delete("/:id", isAuthenticated, deleteConfession);
router.post("/:id/react", isAuthenticated, reactToConfession);

// POST /api/confessions/:id/comments (Only authenticated agents can add notes)
router.post("/:id/comments", isAuthenticated, addComment); 

export default router;