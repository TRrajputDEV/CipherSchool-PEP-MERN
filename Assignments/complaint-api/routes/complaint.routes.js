import express from 'express';
import {getAllComplaints, createComplaint, resolveComplaint, deleteComplaint} from '../controllers/complaint.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllComplaints);
router.post('/',createComplaint);

// Protected routes
router.put('/:id/resolve', authMiddleware, resolveComplaint);
router.delete('/:id', authMiddleware, deleteComplaint);

export default router;