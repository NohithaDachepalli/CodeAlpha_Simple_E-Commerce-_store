import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">Profile</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="panel h-max p-5">
          <h2 className="font-bold">{user.name}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">{user.role}</p>
        </section>
        <section className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800"><h2 className="text-xl font-bold">Order history</h2></div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {orders.map((order) => (
              <div className="grid gap-2 p-5 md:grid-cols-4" key={order._id}>
                <span className="font-mono text-xs">{order._id}</span>
                <span>${order.totalAmount.toFixed(2)}</span>
                <span className="font-semibold text-emerald-600">{order.status}</span>
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="p-5 text-slate-500">No orders yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
