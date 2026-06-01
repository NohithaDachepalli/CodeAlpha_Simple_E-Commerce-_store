import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext.jsx';
import api from '../services/api.js';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '', country: '', phone: '' });

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/orders', {
        products: items.map((item) => ({ product: item._id, quantity: item.quantity })),
        shippingAddress,
        paymentMethod
      });
      clearCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="panel space-y-4 p-5">
          <h2 className="text-xl font-bold">Shipping address</h2>
          {Object.keys(shippingAddress).map((key) => (
            <input key={key} className="input" placeholder={key.replace(/([A-Z])/g, ' $1')} value={shippingAddress[key]} onChange={(event) => setShippingAddress({ ...shippingAddress, [key]: event.target.value })} />
          ))}
          <h2 className="pt-4 text-xl font-bold">Payment method</h2>
          <select className="input" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
            <option value="COD">Cash on Delivery</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
        <aside className="panel h-max p-5">
          <h2 className="text-xl font-bold">Order summary</h2>
          <div className="mt-4 space-y-3">{items.map((item) => <div className="flex justify-between text-sm" key={item._id}><span>{item.name} x {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}</div>
          <div className="mt-4 border-t border-slate-200 pt-4 text-lg font-extrabold dark:border-slate-700">${subtotal.toFixed(2)}</div>
          <button className="btn-primary mt-5 w-full" disabled={!items.length}>Place order</button>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
