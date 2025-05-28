// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Función para validar la estructura del usuario
const isValidUser = (user) => {
  return user && 
         typeof user.id === 'number' && 
         typeof user.rol === 'string' && 
         ['Admin', 'Business', 'User'].includes(user.rol);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log("Recuperando usuario de localStorage");
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Usuario crudo de localStorage:", parsedUser);
        
        if (isValidUser(parsedUser)) {
          console.log("Usuario válido encontrado:", parsedUser);
          setUser(parsedUser);
        } else {
          console.warn("Usuario inválido en localStorage. Limpiando...", parsedUser);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error("Error al parsear usuario de localStorage:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      console.log("No se encontró usuario en localStorage");
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    if (!isValidUser(userData)) {
      console.error("Datos de usuario inválidos al iniciar sesión:", userData);
      return;
    }
    
    console.log("Iniciando sesión con usuario válido:", userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log("Cerrando sesión");
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user && isValidUser(user)  // Nueva propiedad
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);