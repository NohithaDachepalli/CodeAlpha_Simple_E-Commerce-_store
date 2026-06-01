import { Heart, LogOut, Menu, Moon, Package, ShoppingBag, ShoppingCart, Sun, User } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import SearchBox from '../components/SearchBox.jsx';

const navClass = ({ isActive }) =>
  `text-sm font-semibold ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600 dark:text-slate-300'}`;

const MainLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold">
            <ShoppingBag className="text-emerald-600" />
            ShopEase
          </Link>
          <div className="hidden flex-1 justify-center lg:flex">
            <SearchBox />
          </div>
          <nav className="ml-auto hidden items-center gap-5 md:flex">
            <NavLink className={navClass} to="/products">Products</NavLink>
            <NavLink className={navClass} to="/faq">FAQ</NavLink>
            <NavLink className={navClass} to="/contact">Contact</NavLink>
            {isAdmin && <NavLink className={navClass} to="/admin">Admin</NavLink>}
          </nav>
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/wishlist" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Wishlist"><Heart size={20} /></Link>
          <Link to="/cart" className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Cart">
            <ShoppingCart size={20} />
            {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-emerald-600 px-1.5 text-xs font-bold text-white">{count}</span>}
          </Link>
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/profile" className="btn-secondary px-3"><User size={16} />{user.name.split(' ')[0]}</Link>
              <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => logout()} aria-label="Logout"><LogOut size={19} /></button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden sm:inline-flex"><User size={16} />Login</Link>
          )}
          <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Open menu"><Menu /></button>
        </div>
        <div className="border-t border-slate-100 px-4 py-3 lg:hidden dark:border-slate-800"><SearchBox /></div>
        {open && (
          <div className="space-y-3 border-t border-slate-200 px-4 py-4 md:hidden dark:border-slate-800">
            <NavLink className={navClass} to="/products">Products</NavLink>
            <NavLink className={navClass} to="/profile">Profile</NavLink>
            <NavLink className={navClass} to="/faq">FAQ</NavLink>
            <NavLink className={navClass} to="/contact">Contact</NavLink>
            {isAdmin && <NavLink className={navClass} to="/admin">Admin</NavLink>}
          </div>
        )}
      </header>
      <main><Outlet /></main>
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-extrabold"><Package className="text-emerald-600" />ShopEase</div>
            <p className="mt-3 text-sm text-slate-500">Modern essentials, curated for everyday living.</p>
          </div>
          {['Shop', 'Support', 'Company'].map((title) => (
            <div key={title}>
              <h3 className="font-bold">{title}</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-500">
                <Link className="block hover:text-emerald-600" to="/products">Products</Link>
                <Link className="block hover:text-emerald-600" to="/faq">FAQ</Link>
                <Link className="block hover:text-emerald-600" to="/contact">Contact</Link>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
