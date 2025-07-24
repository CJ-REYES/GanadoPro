const API_URL = 'http://localhost:5201/api/Animales';

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

const transformAnimal = (animal) => {
  return {
    id_Animal: animal.Id_Animal,
    arete: animal.Arete || "Sin arete",
    raza: animal.Raza || "Desconocida",
    peso: animal.Peso || 0,
    edad_Meses: animal.Edad_Meses || 0,
    id_Lote: animal.Id_Lote,
    sexo: animal.Sexo || "Desconocido"
  };
};

export const getAnimalesEnStock = async () => {
  try {
    const data = await fetchWithAuth(`${API_URL}/enstock`);
    return data.map(transformAnimal);
  } catch (error) {
    console.error('Error al obtener animales en stock:', error);
    throw error;
  }
};

export const asignarAnimalesALote = async (loteId, animalIds) => {
  await fetchWithAuth(`${API_URL}/asignar-lote`, {
    method: 'PUT',
    body: JSON.stringify({
      Id_Lote: loteId,
      Ids_Animales: animalIds
    }),
  });
};

export const eliminarAnimalDeLote = async (animalId) => {
  await fetchWithAuth(`${API_URL}/${animalId}/remover-lote`, {
    method: 'PATCH',
    body: JSON.stringify({
      Id_Lote: null
    }),
  });
};

export const getConteoAnimalesEnStock = async () => {
  return await fetchWithAuth(`${API_URL}/count/enstock`);
};

export const getConteoAnimalesVendidos = async () => {
  return await fetchWithAuth(`${API_URL}/count/vendidos`);
};