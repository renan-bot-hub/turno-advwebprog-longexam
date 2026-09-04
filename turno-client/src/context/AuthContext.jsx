import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  function saveSession(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      saveSession(res.data);
      return { success: true, role: res.data.user.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed.' };
    } finally { setLoading(false); }
  }

  async function register(firstName, lastName, email, password) {
    setLoading(true);
    try {
      const res = await authApi.register({ firstName, lastName, email, password });
      saveSession(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed.' };
    } finally { setLoading(false); }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function refreshUser() {
    try {
      const res = await authApi.getMe();
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch { logout(); }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, isCustomer, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
