// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, clearToken, clearUser } from '@/hooks/useToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getToken();
    
    if (storedUser && storedToken) {
      try {
        setUser(storedUser);
      } catch (error) {
        console.error("Error al obtener usuario de localStorage:", error);
        clearAuthData();
      }
    }
    setLoading(false);
  }, []);

  // Función centralizada para limpiar datos de autenticación
  const clearAuthData = () => {
    clearToken();
    clearUser();
    setUser(null);
  };

  const login = (token, userData) => {
    setUser(userData);
    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    clearAuthData();
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);