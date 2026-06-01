import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import Rating from './Rating.jsx';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();

  return (
    <article className="panel group overflow-hidden">
      <Link to={`/products/${product._id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-600">{product.category}</p>
            <Link to={`/products/${product._id}`} className="mt-1 line-clamp-2 font-semibold hover:text-emerald-600">
              {product.name}
            </Link>
          </div>
          <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => toggleWishlist(product)} aria-label="Toggle wishlist">
            <Heart size={18} fill={isWished(product._id) ? 'currentColor' : 'none'} className="text-rose-500" />
          </button>
        </div>
        <Rating value={product.rating} count={product.numReviews || product.reviews?.length || 0} />
        <div className="flex items-center justify-between">
          <span className="text-lg font800 font-bold">${product.price.toFixed(2)}</span>
          <button className="btn-primary px-3 py-2" onClick={() => addToCart(product, 1)} disabled={product.stock < 1}>
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
