// src/services/ranchoService.js
const API_URL = 'http://localhost:5201/api/Ranchos';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token'); // Asegúrate que el token está en localStorage
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Manejo detallado de errores
    let errorMessage = 'Error en la solicitud';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch (e) {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null; // Para respuestas sin contenido
  }

  return response.json();
};

// Función para transformar las propiedades a minúsculas
const transformRancho = (rancho) => {
  return {
    id_Rancho: rancho.Id_Rancho,
    id_User: rancho.Id_User,
    nombreRancho: rancho.NombreRancho,
    ubicacion: rancho.Ubicacion,
    propietario: rancho.Propietario,
    telefono: rancho.Telefono,
    email: rancho.Email,
    totalLotes: rancho.TotalLotes
  };
};

export const getRanchos = async () => {
  const data = await fetchWithAuth(API_URL);
  return data.map(transformRancho);
};

export const getRanchoById = async (id) => {
  const data = await fetchWithAuth(`${API_URL}/${id}`);
  return transformRancho(data);
};

export const createRancho = async (ranchoData) => {
  const data = await fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify(ranchoData),
  });
  return transformRancho(data);
};

export const updateRancho = async (id, ranchoData) => {
  const data = await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ranchoData),
  });
  return data ? transformRancho(data) : null;
};

export const deleteRancho = async (id) => {
  await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return id;
};