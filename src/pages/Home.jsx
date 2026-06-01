import { ArrowRight, ShieldCheck, Truck, Zap, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/Skeleton.jsx';
import api from '../services/api.js';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Fitness', 'Travel'];

  useEffect(() => {
    // Load products
    api.get('/products?limit=8&sort=rating')
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));

    // Load recently viewed products
    try {
      const stored = JSON.parse(localStorage.getItem('shopease_recent') || '[]');
      setRecentProducts(stored);
    } catch {
      setRecentProducts([]);
    }
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      return toast.error('Please enter a valid email address');
    }

    setSubmittingNewsletter(true);
    try {
      const { data } = await api.post('/newsletter', { email: newsletterEmail });
      toast.success(data.message || 'Subscribed successfully!');
      setNewsletterEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Newsletter subscription failed');
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[linear-gradient(120deg,#ecfdf5_0%,#f8fafc_55%,#e0f2fe_100%)] dark:bg-[linear-gradient(120deg,#052e2b_0%,#0f172a_55%,#172554_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="font-semibold text-emerald-600">Summer edit is live</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-5xl">ShopEase</h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
              Discover smart tech, refined home goods, and everyday essentials with fast checkout and reliable delivery.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">Shop collection <ArrowRight size={18} /></Link>
              <Link to="/products?sort=rating" className="btn-secondary">Top rated</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
              {[
                ['Fast delivery', Truck],
                ['Secure checkout', ShieldCheck],
                ['Fresh drops', Zap]
              ].map(([label, Icon]) => (
                <div className="flex items-center gap-2 rounded-lg bg-white/70 p-3 dark:bg-slate-900/60" key={label}>
                  <Icon size={18} className="text-emerald-600" />
                  <span className="font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img className="aspect-[5/4] w-full rounded-lg object-cover shadow-soft" src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80" alt="ShopEase product collection" />
            <div className="absolute bottom-4 left-4 rounded-lg bg-white/92 p-4 shadow-soft dark:bg-slate-950/90">
              <p className="text-sm text-slate-500">Members save up to</p>
              <p className="text-3xl font-extrabold text-emerald-600">35%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-emerald-600">Featured products</p>
            <h2 className="mt-1 text-2xl font-extrabold">Popular right now</h2>
          </div>
          <Link to="/products" className="btn-secondary">View all</Link>
        </div>
        <div className="mt-6">{loading ? <ProductGridSkeleton /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard product={product} key={product._id} />)}</div>}</div>
      </section>

      {/* Categories */}
      <section className="bg-white py-12 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-extrabold">Shop by category</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category) => (
              <Link key={category} to={`/products?category=${category}`} className="rounded-lg border border-slate-200 p-5 font-bold text-center transition hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed Products */}
      {recentProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 border-t border-slate-100 dark:border-slate-900">
          <div>
            <p className="font-semibold text-emerald-600">Based on your activity</p>
            <h2 className="mt-1 text-2xl font-extrabold">Recently Viewed</h2>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recentProducts.map((product) => (
              <ProductCard product={product} key={`recent-${product._id}`} />
            ))}
          </div>
        </section>
      )}

      {/* Promo Banners */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-slate-950 p-8 text-white flex flex-col justify-between">
            <div>
              <p className="text-emerald-300 font-semibold">Limited offer</p>
              <h3 className="mt-2 text-2xl font-extrabold">Free shipping over $99</h3>
              <p className="mt-2 text-slate-300">Applies automatically at checkout.</p>
            </div>
          </div>
          <div className="rounded-lg bg-emerald-600 p-8 text-white flex flex-col justify-between">
            <div>
              <p className="text-emerald-100 font-semibold">New arrivals</p>
              <h3 className="mt-2 text-2xl font-extrabold">Fresh styles every week</h3>
              <p className="mt-2 text-emerald-50">Curated products across home, fashion, and tech.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="bg-slate-100 py-16 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
            <Mail className="text-emerald-600 dark:text-emerald-500" size={24} />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            Subscribe to our Newsletter
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Get early access to fresh drops, member-only discounts, and curated product updates directly to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="input sm:max-w-xs"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              disabled={submittingNewsletter}
            />
            <button
              type="submit"
              className="btn-primary py-2.5 px-6 font-semibold"
              disabled={submittingNewsletter}
            >
              {submittingNewsletter ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
