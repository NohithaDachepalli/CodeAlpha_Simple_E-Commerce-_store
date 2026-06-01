import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getStats = async (req, res) => {
  const [users, products, orders, delivered] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.find({ status: 'Delivered' })
  ]);

  const revenue = delivered.reduce((sum, order) => sum + order.totalAmount, 0);
  const recentOrders = await Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5);

  res.json({
    users,
    products,
    orders,
    revenue,
    recentOrders
  });
};
