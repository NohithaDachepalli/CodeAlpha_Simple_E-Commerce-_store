import express from 'express';
import { getStats } from '../controllers/adminController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getStats);

export default router;
