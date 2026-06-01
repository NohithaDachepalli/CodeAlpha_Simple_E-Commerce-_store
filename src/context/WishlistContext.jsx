import { createContext, useContext, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useLocalStorage('shopease_wishlist', []);

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item._id === product._id);
    setWishlist(exists ? wishlist.filter((item) => item._id !== product._id) : [...wishlist, product]);
    toast.success(exists ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const value = useMemo(() => ({ wishlist, toggleWishlist, isWished: (id) => wishlist.some((item) => item._id === id) }), [wishlist]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
