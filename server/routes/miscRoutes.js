import express from 'express';
import { body } from 'express-validator';
import { contact, subscribe } from '../controllers/miscController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/newsletter', body('email').isEmail().normalizeEmail(), validate, subscribe);
router.post('/contact', [body('name').trim().notEmpty(), body('email').isEmail(), body('message').trim().isLength({ min: 10 })], validate, contact);

export default router;
