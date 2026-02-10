import express from "express";
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/complaintController.js";

const router = express.Router();

// GET all complaints
router.get("/", getAllComplaints);

// GET complaint by id
router.get("/:id", getComplaintById);

// POST new complaint
router.post("/", createComplaint);

// PUT update status
router.put("/:id", updateComplaintStatus);

// DELETE complaint
router.delete("/:id", deleteComplaint);

export default router;