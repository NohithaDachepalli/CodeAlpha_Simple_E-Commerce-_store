import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { user: req.user._id, items: [] });
};

export const saveCart = async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: req.body.items || [] },
    { new: true, upsert: true, runValidators: true }
  ).populate('items.product');
  res.json(cart);
};
