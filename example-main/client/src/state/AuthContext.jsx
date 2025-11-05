import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('sr_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sr_token'));

  useEffect(() => {
    if (user) localStorage.setItem('sr_user', JSON.stringify(user));
    else localStorage.removeItem('sr_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('sr_token', token);
    else localStorage.removeItem('sr_token');
  }, [token]);

  const login = (newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  // Attach token to axios
  useEffect(() => {
    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
  }, [token]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
