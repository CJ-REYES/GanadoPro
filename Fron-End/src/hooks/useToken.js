// src/hooks/useToken.js
import { useState, useEffect } from 'react';

export default function useToken() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return [token, setToken, clearToken];
}