const API_URL = 'http://localhost:5201/api/Actividades';

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

const transformActividad = (actividad) => {
  return {
    id: actividad.Id,
    tipo: actividad.Tipo,
    descripcion: actividad.Descripcion,
    tiempo: actividad.Tiempo ? new Date(actividad.Tiempo) : null,
    estado: actividad.Estado,
    accion: actividad.Accion,
    entidadId: actividad.EntidadId,
    tipoEntidad: actividad.TipoEntidad
  };
};

export const getActividadesRecientes = async () => {
  const data = await fetchWithAuth(`${API_URL}/recientes`);
  return data.map(transformActividad);
};

// Opcional: Si necesitas más endpoints en el futuro
export const getActividadById = async (id) => {
  const data = await fetchWithAuth(`${API_URL}/${id}`);
  return transformActividad(data);
};

// Ejemplo de cómo podrías implementar creación de actividades si fuera necesario
export const createActividad = async (actividadData) => {
  const data = await fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      Tipo: actividadData.tipo,
      Descripcion: actividadData.descripcion,
      Tiempo: actividadData.tiempo,
      Estado: actividadData.estado,
      Accion: actividadData.accion,
      EntidadId: actividadData.entidadId,
      TipoEntidad: actividadData.tipoEntidad
    }),
  });
  return transformActividad(data);
};