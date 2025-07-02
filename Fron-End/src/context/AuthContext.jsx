// AuthContext.jsx corregido
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Estado para el token
  const [loading, setLoading] = useState(true);
  
  // Obtener token de localStorage
  const getStoredToken = () => localStorage.getItem('token');
  const getStoredUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken); // Establecer token en estado
    }
    setLoading(false);
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null); // Limpiar token
  };

  const login = (newToken, userData) => {
    setUser(userData);
    setToken(newToken); // Guardar token en estado
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    clearAuthData();
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, // Exponer token
      login, 
      logout, 
      loading,
      isAuthenticated: !!token // Verificar por token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);