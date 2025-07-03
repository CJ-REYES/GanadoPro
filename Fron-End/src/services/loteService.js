// src/services/loteService.js
const API_URL = 'http://localhost:5201/api/Lotes';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
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
    return null;
  }

  return response.json();
};

// Función para transformar las propiedades a minúsculas
const transformLote = (lote) => {
  return {
    id_Lote: lote.Id_Lote,
    id_User: lote.Id_User,
    remo: lote.Remo,
    fechaEntrada: lote.Fecha_Entrada ? new Date(lote.Fecha_Entrada) : null,
    fechaCreacion: lote.Fecha_Creacion ? new Date(lote.Fecha_Creacion) : null,
    fechaSalida: lote.Fecha_Salida ? new Date(lote.Fecha_Salida) : null,
    estado: lote.Estado,
    observaciones: lote.Observaciones,
    id_Cliente: lote.Id_Cliente,
    id_Rancho: lote.Id_Rancho,
    // Relaciones
    user: lote.User ? {
      id_User: lote.User.Id_User,
      nombre: lote.User.Nombre
    } : null,
    cliente: lote.Cliente ? {
      id_Cliente: lote.Cliente.Id_Cliente,
      nombre: lote.Cliente.Nombre
    } : null,
    animales: lote.Animales ? lote.Animales.map(animal => ({
      id_Animal: animal.Id_Animal,
      arete: animal.Arete,
      // Agregar más campos si son necesarios
      sexo: animal.Sexo || 'N/A',
      edad: animal.Edad_Meses || 0,  
      peso: animal.Peso || 0
    })) : [],
    rancho: lote.Rancho ? {
      id_Rancho: lote.Rancho.Id_Rancho,
      nombre: lote.Rancho.Nombre,
      ubicacion: lote.Rancho.Ubicacion
    } : null,
    // Campos calculados o para mostrar
    nombreRancho: lote.Rancho?.Nombre,
    comunidad: lote.Rancho?.Ubicacion,
    totalAnimales: lote.Animales?.length || 0
  };
};

export const getLotes = async () => {
  const data = await fetchWithAuth(API_URL);
  return data.map(transformLote);
};

export const getLoteById = async (id) => {
  const data = await fetchWithAuth(`${API_URL}/${id}`);
  return transformLote(data);
};

export const createLote = async (loteData) => {
  const data = await fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      Remo: parseInt(loteData.remo),
      Id_Rancho: parseInt(loteData.id_rancho)
    }),
  });
  return transformLote(data);
};

export const updateLote = async (id, loteData) => {
  const data = await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      Id_Lote: parseInt(id),  // Añade esto
      Estado: loteData.estado,
      // Agrega los demás campos necesarios
      Remo: parseInt(loteData.Remo)
      
      // ... otros campos requeridos por el backend
    }),
  });
  return data ? transformLote(data) : null;
};

export const deleteLote = async (id) => {
  await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return id;
};