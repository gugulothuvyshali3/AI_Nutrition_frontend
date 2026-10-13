import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('nutrismart_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('nutrismart_token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      if (res && res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('nutrismart_user', JSON.stringify(res.user));
        if (res.token) {
          localStorage.setItem('nutrismart_token', res.token);
        }
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      if (res && res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('nutrismart_user', JSON.stringify(res.user));
        if (res.token) {
          localStorage.setItem('nutrismart_token', res.token);
        }
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nutrismart_user');
    localStorage.removeItem('nutrismart_token');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
