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

  try {
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
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const safeDateParse = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const transformVentaCompletada = (venta) => ({
  id_Venta: venta.Id_Venta,
  fechaSalida: safeDateParse(venta.FechaSalida) || new Date(),
  folioGuiaRemo: venta.FolioGuiaRemo,
  tipoVenta: venta.TipoVenta,
  estado: venta.Estado,
  cliente: venta.Cliente,
  upp: venta.UPP,
  lotes: venta.Lotes.map(transformLoteVendidoInfo)
});

const transformLoteVendidoInfo = (lote) => ({
  id_Lote: lote.Id_Lote,
  remO: lote.REMO,
  comunidad: lote.Comunidad,
  cantidadAnimales: lote.CantidadAnimales,
  estado: lote.Estado,
  animales: lote.Animales ? lote.Animales.map(transformAnimal) : []
});

const transformAnimal = (animal) => ({
  id_Animal: animal.Id_Animal,
  arete: animal.Arete || "Sin arete",
  raza: animal.Raza || "Desconocida",
  peso: animal.Peso || 0,
  sexo: animal.Sexo || "Desconocido",
  fechaSalida: safeDateParse(animal.FechaSalida)
});

const transformOrdenVenta = (orden) => ({
  id: orden.Id_Venta,
  fechaSalida: new Date(orden.FechaSalida), // Conversión directa a Date
  folioGuiaRemo: orden.FolioGuiaRemo,
  tipoVenta: orden.TipoVenta === 0 ? 'Nacional' : 'Internacional',
  cliente: orden.Cliente,
  upp: orden.UPP,
  estado: orden.Estado,
  lotes: (orden.Lotes || []).map(lote => ({
    id: lote.Id_Lote,
    remO: lote.REMO,
    comunidad: lote.Comunidad,
    cantidadAnimales: lote.CantidadAnimales,
  })),
  totalAnimales: (orden.Lotes || []).reduce((sum, lote) => sum + (lote.CantidadAnimales || 0), 0)
});


export const getVentasCompletadas = async () => {
  try {
    const data = await fetchWithAuth(`${API_URL}/VentasCompletadas`);
    return data.map(transformVentaCompletada);
  } catch (error) {
    console.error('Error al obtener ventas completadas:', error);
    throw error;
  }
};

export const getAnimalesLote = async (idLote) => {
  try {
    const data = await fetchWithAuth(`${API_URL}/Lotes/${idLote}/Animales`);
    return data.map(transformAnimal);
  } catch (error) {
    console.error('Error al obtener animales del lote:', error);
    throw error;
  }
};

export const getOrdenesVenta = async () => {
  try {
    const data = await fetchWithAuth(API_URL);
    return data.map(transformOrdenVenta);
  } catch (error) {
    console.error('Error al obtener las órdenes de venta:', error);
    throw error;
  }
};

export const createOrdenVenta = async (ordenData) => {
  try {
    const tipoVentaNum = ordenData.ventaDto.tipoVenta;
    
    const response = await fetchWithAuth(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        FechaSalida: ordenData.ventaDto.fechaSalida.toISOString(),
        FolioGuiaRemo: ordenData.ventaDto.folioGuiaRemo,
        TipoVenta: tipoVentaNum,
        LotesIds: ordenData.ventaDto.lotesIds,
        Id_Cliente: ordenData.ventaDto.idCliente,
        UPP: ordenData.ventaDto.upp,
        Id_Rancho: ordenData.ventaDto.idRancho
      })
    });
    
    // Transformar respuesta
    return {
      ...response,
      fechaSalida: new Date(response.FechaSalida),
      tipoVenta: response.TipoVenta === 0 ? 'Nacional' : 'Internacional'
    };
  } catch (error) {
    console.error('Error al crear la orden de venta:', error);
    throw error;
  }
};

export const updateOrdenVenta = async (id, ordenData) => {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        FechaSalida: ordenData.ventaDto.fechaSalida.toISOString(),
        FolioGuiaRemo: ordenData.ventaDto.folioGuiaRemo,
        TipoVenta: ordenData.ventaDto.tipoVenta
      })
    });
    
    // CORRECCIÓN: Manejar respuesta nula (204 No Content)
    if (response === null) {
      return null;
    }
    
    return {
      ...response,
      fechaSalida: new Date(response.FechaSalida),
      tipoVenta: response.TipoVenta === 0 ? 'Nacional' : 'Internacional'
    };
  } catch (error) {
    console.error('Error al actualizar la orden de venta:', error);
    throw error;
  }
};

export const deleteOrdenVenta = async (id) => {
  try {
    await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error('Error al eliminar la orden de venta:', error);
    throw error;
  }
};
export const deleteVentaCompletada = async (id) => {
  try {
    await fetchWithAuth(`${API_URL}/Completadas/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error('Error al eliminar la venta completada:', error);
    throw error;
  }
};

export const getLotesDisponibles = async () => {
  try {
    const data = await fetchWithAuth(`${API_URL}/lotes-disponibles`);

return data.map(lote => ({
  id_Lote: lote.Id_Lote,
  remo: lote.REMO || lote.remo, // Asegura compatibilidad
  comunidad: lote.Comunidad,
  cantidadAnimales: lote.CantidadAnimales
}));
  } catch (error) {
    console.error('Error al obtener lotes disponibles:', error);
    throw error;
  }
};