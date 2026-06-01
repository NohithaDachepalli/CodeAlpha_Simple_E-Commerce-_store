import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body;
  if (!products?.length) return res.status(400).json({ message: 'No order items' });

  const ids = products.map((item) => item.product);
  const dbProducts = await Product.find({ _id: { $in: ids } });

  const orderItems = products.map((item) => {
    const dbProduct = dbProducts.find((product) => product._id.toString() === item.product);
    if (!dbProduct) throw new Error('Product not found');
    if (dbProduct.stock < item.quantity) throw new Error(`${dbProduct.name} is out of stock`);
    return {
      product: dbProduct._id,
      name: dbProduct.name,
      image: dbProduct.image,
      price: dbProduct.price,
      quantity: item.quantity
    };
  });

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({
    user: req.user._id,
    products: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod
  });

  await Promise.all(
    orderItems.map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }))
  );

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

export const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ message: 'Order deleted' });
};
