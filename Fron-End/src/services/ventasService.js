const API_URL = 'http://localhost:5201/api/Ventas';

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

// Transformar venta completada
const transformVentaCompletada = (venta) => ({
  id_Venta: venta.Id_Venta,
  fechaSalida: new Date(venta.FechaSalida),
  folioGuiaRemo: venta.FolioGuiaRemo,
  tipoVenta: venta.TipoVenta,
  estado: venta.Estado,
  cliente: venta.Cliente,
  upp: venta.UPP,
  lotes: venta.Lotes.map(transformLoteVendidoInfo)
});

// Transformar información de lote vendido
const transformLoteVendidoInfo = (lote) => ({
  id_Lote: lote.Id_Lote,
  remO: lote.REMO,
  comunidad: lote.Comunidad,
  cantidadAnimales: lote.CantidadAnimales,
  estado: lote.Estado,
  animales: lote.Animales ? lote.Animales.map(transformAnimal) : []
});

// Transformar animal
const transformAnimal = (animal) => ({
  id_Animal: animal.Id_Animal,
  arete: animal.Arete || "Sin arete",
  raza: animal.Raza || "Desconocida",
  peso: animal.Peso || 0,
  sexo: animal.Sexo || "Desconocido",
  fechaSalida: animal.FechaSalida,
});

// Obtener ventas completadas
export const getVentasCompletadas = async () => {
  try {
    const data = await fetchWithAuth(`${API_URL}/VentasCompletadas`);
    return data.map(transformVentaCompletada);
  } catch (error) {
    console.error('Error al obtener ventas completadas:', error);
    throw error;
  }
};

// Obtener animales de un lote vendido
export const getAnimalesLote = async (idLote) => {
  try {
    const data = await fetchWithAuth(`${API_URL}/Lotes/${idLote}/Animales`);
    return data.map(transformAnimal);
  } catch (error) {
    console.error('Error al obtener animales del lote:', error);
    throw error;
  }
};

// Obtener lotes vendidos (mantenido por compatibilidad)
export const getLotesVendidos = async () => {
  try {
    const data = await fetchWithAuth(`${API_URL}/LotesVendidos`);
    return data.map(lote => ({
      id_Lote: lote.Id_Lote,
      nombre: lote.Nombre || "Sin nombre",
      remO: lote.REMO,
      comunidad: lote.Comunidad || "",
      upp_Cliente: lote.UPP_Cliente || "",
      nombre_Cliente: lote.Nombre_Cliente || "Sin cliente",
      fecha_Venta: lote.Fecha_Venta,
      animalesCount: lote.Animales?.length || 0,
      animales: [],
    }));
  } catch (error) {
    console.error('Error al obtener lotes vendidos:', error);
    throw error;
  }
};