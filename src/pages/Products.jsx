import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/Skeleton.jsx';
import api from '../services/api.js';

const Products = () => {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ products: [], categories: [], pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => Object.fromEntries(params.entries()), [params]);

  useEffect(() => {
    setLoading(true);
    api.get(`/products?${params.toString()}`)
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [params]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-semibold text-emerald-600">Catalog</p>
          <h1 className="text-3xl font-extrabold">Products</h1>
        </div>
        <select className="input max-w-xs" value={query.sort || 'newest'} onChange={(event) => update('sort', event.target.value)}>
          <option value="newest">Newest</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="panel h-max p-4">
          <div className="mb-4 flex items-center gap-2 font-bold"><SlidersHorizontal size={18} />Filters</div>
          <label className="text-sm font-semibold">Category</label>
          <select className="input mt-2" value={query.category || ''} onChange={(event) => update('category', event.target.value)}>
            <option value="">All categories</option>
            {data.categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-semibold">Min</label>
              <input className="input mt-2" type="number" value={query.minPrice || ''} onChange={(event) => update('minPrice', event.target.value)} />
            </div>
            <div>
              <label className="text-sm font-semibold">Max</label>
              <input className="input mt-2" type="number" value={query.maxPrice || ''} onChange={(event) => update('maxPrice', event.target.value)} />
            </div>
          </div>
        </aside>
        <section>
          {loading ? <ProductGridSkeleton /> : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{data.products.map((product) => <ProductCard product={product} key={product._id} />)}</div>
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: data.pages || 1 }).map((_, index) => (
                  <button key={index} className={`rounded-lg px-4 py-2 font-semibold ${data.page === index + 1 ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900'}`} onClick={() => update('page', String(index + 1))}>
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;
