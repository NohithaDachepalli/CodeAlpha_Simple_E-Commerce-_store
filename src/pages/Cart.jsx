import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">Shopping cart</h1>
      {items.length === 0 ? (
        <div className="panel mt-6 p-8 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link className="btn-primary mt-4" to="/products">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div className="panel flex gap-4 p-4" key={item._id}>
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h2 className="font-bold">{item.name}</h2>
                    <p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input className="input w-20" type="number" min="1" max={item.stock} value={item.quantity} onChange={(event) => updateQuantity(item._id, Number(event.target.value))} />
                    <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => removeFromCart(item._id)}><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="panel h-max p-5">
            <h2 className="text-xl font-extrabold">Cart summary</h2>
            <div className="mt-4 flex justify-between"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div className="mt-2 flex justify-between text-sm text-slate-500"><span>Shipping</span><span>{subtotal > 99 ? 'Free' : '$8.00'}</span></div>
            <div className="mt-4 border-t border-slate-200 pt-4 text-lg font-extrabold dark:border-slate-700">${(subtotal + (subtotal > 99 ? 0 : 8)).toFixed(2)}</div>
            <Link to="/checkout" className="btn-primary mt-5 w-full">Checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
