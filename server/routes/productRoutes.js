import express from 'express';
import { body } from 'express-validator';
import {
  addReview,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const productRules = [
  body('name').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('category').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('image').isURL().withMessage('Image must be a valid URL'),
  body('stock').isInt({ min: 0 })
];

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, productRules, validate, createProduct);
router.put('/:id', protect, admin, productRules, validate, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post(
  '/:id/reviews',
  protect,
  [body('rating').isInt({ min: 1, max: 5 }), body('comment').trim().isLength({ min: 3 })],
  validate,
  addReview
);

export default router;
