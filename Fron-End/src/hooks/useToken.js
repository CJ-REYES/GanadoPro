// src/hooks/useToken.js
import { useState, useEffect } from 'react';

export default function useToken() {
  const [token, setTokenState] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setTokenState(localStorage.getItem('token') || null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setTokenState(newToken);
  };

  return [token, setToken];
}