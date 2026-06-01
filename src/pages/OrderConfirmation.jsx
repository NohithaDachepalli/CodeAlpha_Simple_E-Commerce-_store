import { CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const OrderConfirmation = () => {
  const { id } = useParams();
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-10 text-center">
      <div className="panel p-8">
        <CheckCircle2 className="mx-auto text-emerald-600" size={60} />
        <h1 className="mt-4 text-3xl font-extrabold">Order confirmed</h1>
        <p className="mt-2 text-slate-500">Your order `{id}` has been placed successfully.</p>
        <div className="mt-6 flex justify-center gap-3"><Link className="btn-primary" to="/profile">Track order</Link><Link className="btn-secondary" to="/products">Continue shopping</Link></div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
