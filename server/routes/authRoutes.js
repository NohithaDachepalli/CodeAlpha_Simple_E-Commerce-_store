import express from 'express';
import { body } from 'express-validator';
import { getProfile, loginUser, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validate,
  loginUser
);

router.get('/profile', protect, getProfile);

export default router;
