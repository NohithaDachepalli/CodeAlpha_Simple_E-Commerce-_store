import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-semibold text-emerald-600">Favorites</p>
          <h1 className="text-3xl font-extrabold tracking-normal">My Wishlist</h1>
        </div>
        <Link
          to="/products"
          className="btn-secondary group text-xs sm:text-sm font-semibold"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Store
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="panel mt-6 p-12 text-center max-w-2xl mx-auto border border-slate-200 dark:border-slate-800">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30">
            <Heart className="text-rose-500 animate-pulse" size={32} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            Your Wishlist is Empty
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Explore our curated collections, save items you love, and they will show up here.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/products" className="btn-primary">
              <ShoppingBag size={16} />
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
