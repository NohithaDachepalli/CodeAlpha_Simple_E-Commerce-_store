import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-4 py-10">
      <form onSubmit={submit} className="panel w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-extrabold">Create account</h1>
        <input className="input" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        <p className="text-sm text-slate-500">Already have an account? <Link className="font-semibold text-emerald-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
