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
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        if (isValidUser(parsedUser)) {
          setUser(parsedUser);
        } else {
          console.warn("Usuario inválido en localStorage. Limpiando...", parsedUser);
          clearUserData();
        }
      } catch (error) {
        console.error("Error al parsear usuario de localStorage:", error);
        clearUserData();
      }
    }
    setLoading(false);
  }, []);

  // Función centralizada para limpiar datos de usuario
  const clearUserData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('currentRanchoId');
    setUser(null);
  };

  const login = (userData, token) => {
    if (!isValidUser(userData)) {
      console.error("Datos de usuario inválidos al iniciar sesión:", userData);
      return;
    }
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    clearUserData();
    return true; // Indica que el logout fue exitoso
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user && isValidUser(user)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);