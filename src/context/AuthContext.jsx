import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeFetch } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('yashwant_admin_token'));
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('yashwant_admin_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await safeFetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (res.ok && res.data?.success) {
          setAdmin(res.data.admin);
          setToken(storedToken);
        } else if (res.status === 401 || res.status === 403) {
          logout();
        }
      } catch (err) {
        console.error('Auth verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await safeFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok || !res.data?.success) {
        throw new Error(res.error || res.data?.message || 'Login failed. Please check credentials.');
      }

      const data = res.data;
      localStorage.setItem('yashwant_admin_token', data.token);
      setToken(data.token);
      setAdmin(data.admin);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('yashwant_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{
      admin,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
