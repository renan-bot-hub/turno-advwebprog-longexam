import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth.js';
import * as session from '../api/session.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => session.getStoredUser());
  const [token, setToken] = useState(() => session.getToken());
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'Admin';
  const isCustomer = user?.role === 'Customer';

  function saveSession(data, remember = true) {
    setToken(data.token);
    setUser(data.user);
    session.saveSession(data, remember);
  }

  async function login(email, password, remember = true) {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      saveSession(res.data, remember);
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
    session.clearSession();
    // The cart belongs to the person who was signed in
    localStorage.removeItem('cart');
  }

  async function refreshUser() {
    try {
      const res = await authApi.getMe();
      const currentUser = res.data.data;
      setUser(currentUser);
      session.saveUser(currentUser);
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
