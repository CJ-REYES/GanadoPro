const API_URL = 'http://localhost:5201/api/Ranchos';

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
    
    // Intenta obtener el mensaje de error del cuerpo de la respuesta
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorData.detail || errorMessage;
    } catch (e) {
      // Si no se puede parsear como JSON, usa el texto de la respuesta
      const text = await response.text();
      errorMessage = text || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const transformRancho = (rancho) => {
  return {
    id_Rancho: rancho.Id_Rancho,
    id_User: rancho.Id_User,
    nombreRancho: rancho.NombreRancho,
    ubicacion: rancho.Ubicacion,
    propietario: rancho.Propietario,
    telefono: rancho.Telefono,
    email: rancho.Email,
    totalLotes: rancho.TotalLotes,
    totalAnimales: rancho.TotalAnimales || 0
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

export const deleteRancho = async (id, ranchoDestinoId = null) => {
  let url = `${API_URL}/${id}`;
  
  if (ranchoDestinoId !== null) {
    url += `?ranchoDestinoId=${ranchoDestinoId}`;
  }

  return fetchWithAuth(url, {
    method: 'DELETE'
  });
};
export const getRanchosByUser = async () => {
  const data = await fetchWithAuth(`${API_URL}/mis-ranchos`);
  return data.map(transformRancho);
};

export const getResumenGanado = async () => {
  const data = await fetchWithAuth(`${API_URL}/resumen-ganado`);
  return data.map(rancho => ({
    id_Rancho: rancho.Id_Rancho,
    nombreRancho: rancho.NombreRancho,
    totalAnimales: rancho.TotalAnimales,
    totalHembras: rancho.TotalHembras,
    totalMachos: rancho.TotalMachos
  }));
};