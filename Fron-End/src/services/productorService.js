// src/services/productorService.js
const API_URL = 'http://localhost:5201/api/Clientes';

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

// Función para filtrar solo los productores (Rol = "Productor")
const filterProductores = (clientes) => {
  return clientes.filter(cliente => cliente.Rol === "Productor");
};

// Función para transformar los datos del cliente/productor
const transformProductor = (productor) => {
  return {
    Id_Cliente: productor.Id_Cliente,
    Id_User: productor.Id_User,
    Name: productor.Name,
    Propietario: productor.Propietario,
    Domicilio: productor.Domicilio,
    Localidad: productor.Localidad,
    Municipio: productor.Municipio,
    Entidad: productor.Entidad,
    Upp: productor.Upp,
    Rol: productor.Rol
  };
};

export const getProductores = async () => {
  const data = await fetchWithAuth(API_URL);
  const productores = filterProductores(data);
  return productores.map(transformProductor);
};

export const getProductorById = async (id) => {
  const data = await fetchWithAuth(`${API_URL}/${id}`);
  if (data.Rol !== "Productor") {
    throw new Error("El ID no corresponde a un productor");
  }
  return transformProductor(data);
};

export const createProductor = async (productorData) => {
  // Aseguramos que el rol sea "Productor"
  const dataToSend = {
    ...productorData,
    Rol: "Productor"
  };

  const data = await fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify(dataToSend),
  });
  return transformProductor(data);
};

export const updateProductor = async (id, productorData) => {
  // Aseguramos que no se cambie el rol accidentalmente
  const dataToSend = {
    ...productorData,
    Rol: "Productor"
  };

  const data = await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dataToSend),
  });
  return data ? transformProductor(data) : null;
};

export const deleteProductor = async (id) => {
  // Primero verificamos que sea un productor
  const productor = await getProductorById(id);
  if (!productor) {
    throw new Error("Productor no encontrado");
  }

  await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return id;
};

// Función especial para obtener solo los nombres e IDs de productores
export const getProductoresListaSimple = async () => {
  const productores = await getProductores();
  return productores.map(p => ({
    Id_Cliente: p.Id_Cliente,
    Name: p.Name,
    Propietario: p.Propietario
  }));
};