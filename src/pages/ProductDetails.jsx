import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard.jsx';
import Rating from '../components/Rating.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import api from '../services/api.js';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  const loadProduct = () => api.get(`/products/${id}`).then(({ data }) => {
    setProduct(data.product);
    setRelated(data.related);
    const viewed = JSON.parse(localStorage.getItem('shopease_recent') || '[]').filter((item) => item._id !== data.product._id);
    localStorage.setItem('shopease_recent', JSON.stringify([data.product, ...viewed].slice(0, 4)));
  });

  useEffect(() => { loadProduct(); }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    await api.post(`/products/${id}/reviews`, review);
    toast.success('Review added');
    setReview({ rating: 5, comment: '' });
    loadProduct();
  };

  if (!product) return <div className="mx-auto max-w-7xl px-4 py-8"><Skeleton className="h-96" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <img src={product.image} alt={product.name} className="aspect-square w-full rounded-lg object-cover" />
        <div>
          <p className="font-semibold text-emerald-600">{product.category}</p>
          <h1 className="mt-2 text-3xl font-extrabold">{product.name}</h1>
          <div className="mt-3"><Rating value={product.rating} count={product.numReviews || product.reviews.length} /></div>
          <p className="mt-5 text-slate-600 dark:text-slate-300">{product.description}</p>
          <p className="mt-6 text-4xl font-extrabold">${product.price.toFixed(2)}</p>
          <p className={`mt-3 font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
              <button className="p-3" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <button className="p-3" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={16} /></button>
            </div>
            <button className="btn-primary" onClick={() => addToCart(product, quantity)} disabled={product.stock < 1}><ShoppingCart size={18} />Add to cart</button>
            <button className="btn-secondary" onClick={() => toggleWishlist(product)}><Heart size={18} />Wishlist</button>
          </div>
        </div>
      </div>
      <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-2xl font-extrabold">Customer reviews</h2>
          <div className="mt-4 space-y-3">
            {product.reviews.length === 0 && <p className="text-slate-500">No reviews yet.</p>}
            {product.reviews.map((item) => (
              <div className="panel p-4" key={item._id}>
                <div className="flex items-center justify-between"><strong>{item.name}</strong><Rating value={item.rating} /></div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.comment}</p>
              </div>
            ))}
          </div>
        </div>
        {user && (
          <form onSubmit={submitReview} className="panel h-max space-y-3 p-4">
            <h3 className="font-bold">Write a review</h3>
            <select className="input" value={review.rating} onChange={(event) => setReview({ ...review, rating: event.target.value })}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select>
            <textarea className="input min-h-28" value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} placeholder="Share your experience" />
            <button className="btn-primary w-full">Submit review</button>
          </form>
        )}
      </section>
      {related.length > 0 && <section className="mt-12"><h2 className="mb-5 text-2xl font-extrabold">Related products</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item._id} product={item} />)}</div></section>}
    </div>
  );
};

export default ProductDetails;
