import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('products').isArray({ min: 1 }),
    body('shippingAddress.address').trim().notEmpty(),
    body('shippingAddress.city').trim().notEmpty(),
    body('shippingAddress.postalCode').trim().notEmpty(),
    body('shippingAddress.country').trim().notEmpty(),
    body('shippingAddress.phone').trim().notEmpty()
  ],
  validate,
  createOrder
);

router.get('/', protect, getMyOrders);
router.get('/all', protect, admin, getAllOrders);
router.put('/:id', protect, admin, body('status').isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']), validate, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

export default router;
