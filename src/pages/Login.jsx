import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-4 py-10">
      <form onSubmit={submit} className="panel w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-extrabold">Login</h1>
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <p className="text-sm text-slate-500">New here? <Link className="font-semibold text-emerald-600" to="/register">Create an account</Link></p>
      </form>
    </div>
  );
};

export default Login;
