import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('shopease_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('shopease_token');
    if (!token) return;
    api.get('/auth/profile')
      .then(({ data }) => setUser({ id: data._id, name: data.name, email: data.email, role: data.role }))
      .catch(() => logout(false));
  }, []);

  const persist = (payload) => {
    localStorage.setItem('shopease_token', payload.token);
    localStorage.setItem('shopease_user', JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', credentials);
      persist(data);
      toast.success('Welcome back');
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (form) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      persist(data);
      toast.success('Account created');
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('shopease_token');
    localStorage.removeItem('shopease_user');
    setUser(null);
    if (notify) toast.success('Logged out');
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
