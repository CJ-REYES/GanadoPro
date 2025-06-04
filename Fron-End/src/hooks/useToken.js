// src/hooks/useToken.js
// Funciones para manejar token
export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    console.error("No se pudo leer el token:", e);
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("token", token);
     
    } else {
      localStorage.removeItem("token");
    }
  } catch (e) {
    console.error("No se pudo guardar el token:", e);
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem("token");
    console.log("Token eliminado de localStorage");
  } catch (e) {
    console.error("No se pudo eliminar el token:", e);
  }
};

// Funciones para manejar usuario
export const setUser = (user) => {
  try {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log("Usuario guardado en localStorage:", user);
    } else {
      localStorage.removeItem('user');
    }
  } catch (e) {
    console.error("No se pudo guardar el usuario:", e);
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("No se pudo leer el usuario:", e);
    return null;
  }
};

export const clearUser = () => {
  try {
    localStorage.removeItem('user');
    console.log("Usuario eliminado de localStorage");
  } catch (e) {
    console.error("No se pudo eliminar el usuario:", e);
  }
};