import { createContext, useContext, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useLocalStorage('shopease_cart', []);
  const { user } = useAuth();

  const syncCart = async (nextItems) => {
    if (!user) return;
    await api.post('/cart', {
      items: nextItems.map((item) => ({ product: item._id, quantity: item.quantity }))
    }).catch(() => null);
  };

  const addToCart = (product, quantity = 1) => {
    const next = items.some((item) => item._id === product._id)
      ? items.map((item) => (item._id === product._id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item))
      : [...items, { ...product, quantity }];
    setItems(next);
    syncCart(next);
    toast.success('Added to cart');
  };

  const updateQuantity = (id, quantity) => {
    const next = items.map((item) => (item._id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item));
    setItems(next);
    syncCart(next);
  };

  const removeFromCart = (id) => {
    const next = items.filter((item) => item._id !== id);
    setItems(next);
    syncCart(next);
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    syncCart([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(() => ({ items, addToCart, updateQuantity, removeFromCart, clearCart, subtotal, count }), [items, subtotal, count]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
