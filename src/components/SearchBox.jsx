import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const SearchBox = () => {
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (term.trim().length < 2) return setSuggestions([]);
      const { data } = await api.get(`/products?search=${encodeURIComponent(term)}&limit=5`);
      setSuggestions(data.products);
    }, 250);
    return () => clearTimeout(timeout);
  }, [term]);

  const submit = (event) => {
    event.preventDefault();
    if (term.trim()) navigate(`/products?search=${encodeURIComponent(term.trim())}`);
    setSuggestions([]);
  };

  return (
    <form onSubmit={submit} className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
      <input className="input pl-10" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Search products" />
      {suggestions.length > 0 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900">
          {suggestions.map((item) => (
            <button key={item._id} type="button" onClick={() => navigate(`/products/${item._id}`)} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800">
              <img src={item.image} alt="" className="h-10 w-10 rounded object-cover" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchBox;
