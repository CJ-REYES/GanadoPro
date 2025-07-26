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
      sexo: animal.Sexo || 'N/A',
      edad: animal.Edad_Meses || 0,
      peso: animal.Peso || 0
    })) : [],
    rancho: lote.Rancho ? {
      id_Rancho: lote.Rancho.Id_Rancho,
      nombre: lote.Rancho.Nombre,
      ubicacion: lote.Rancho.Ubicacion
    } : null,
    nombreRancho: lote.Rancho?.Nombre,
    comunidad: lote.Rancho?.Ubicacion,
    totalAnimales: lote.Animales?.length || 0
  };
};

export const getLotes = async (estados = null) => {
  let url = API_URL;
  const params = new URLSearchParams();

  if (estados) {
    if (Array.isArray(estados)) {
      // Manejar array de estados: ['Disponible', 'En proceso de venta']
      estados.forEach(estado => params.append('estados', estado));
    } else {
      // Mantener compatibilidad con string único
      params.append('estados', estados);
    }
    url += '?' + params.toString();
  }

  const data = await fetchWithAuth(url);
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
      Id_Lote: parseInt(id),
      Estado: loteData.estado,
      Remo: parseInt(loteData.Remo)
    }),
  });
  return data ? transformLote(data) : null;
};

export const deleteLote = async (id) => {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    return id;
  } catch (error) {
    // Extraer el mensaje de error directamente
    let errorMessage = error.message;
    
    // Intentar parsear el mensaje como JSON si es posible
    try {
      const startIndex = errorMessage.indexOf('{');
      if (startIndex !== -1) {
        const jsonString = errorMessage.substring(startIndex);
        const errorData = JSON.parse(jsonString);
        if (errorData.Message) {
          errorMessage = errorData.Message;
        }
      }
    } catch (parseError) {
      // Mantener el mensaje original si no se puede parsear
    }
    
    throw new Error(errorMessage);
  }
};

export const forceDeleteLote = async (id) => {
  try {
    await fetchWithAuth(`${API_URL}/${id}/force`, {
      method: 'DELETE',
    });
    return id;
  } catch (error) {
    throw new Error(`Error al eliminar forzadamente: ${error.message}`);
  }
};

export const getConteoLotesVendidos = async () => {
  return await fetchWithAuth(`${API_URL}/count/vendidos`);
};

export const getConteoLotesDisponibles = async () => {
  return await fetchWithAuth(`${API_URL}/count/disponibles`);
};