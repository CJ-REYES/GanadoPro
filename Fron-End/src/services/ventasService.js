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
  fechaSalida: new Date(orden.FechaSalida),
  folioGuiaRemo: orden.FolioGuiaRemo,
  tipoVenta: orden.TipoVenta === 0 ? 'Nacional' : 'Internacional',
  cliente: orden.Cliente,
  upp: orden.UPP || "", // Asegurar que se incluya UPP
  estado: orden.Estado,
  idCliente: orden.Id_Cliente, // Añadir idCliente
  idRancho: orden.Id_Rancho,   // Añadir idRancho
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
export const getClientesListaSimple = async () => {
  try {
    const response = await fetchWithAuth(`http://localhost:5201/api/Ventas/clientes-lista-simple`);
    
    // Verificar y normalizar la respuesta
    return response.map(cliente => {
      // Asegurar que las propiedades tengan el formato correcto
      return {
        Id_Cliente: cliente.id_Cliente || cliente.Id_Cliente,
        Name: cliente.name || cliente.Name,
        Upp: cliente.upp || cliente.Upp
      };
    });
  } catch (error) {
    console.error('Error al obtener lista simple de clientes:', error);
    throw error;
  }
};
// Corregir la propiedad UPP en createOrdenVenta
export const createOrdenVenta = async (ordenData) => {
  try {
    // Añadir console.log para depuración
    
    
    const response = await fetchWithAuth(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        FechaSalida: ordenData.ventaDto.fechaSalida.toISOString(),
        FolioGuiaRemo: ordenData.ventaDto.folioGuiaRemo,
        TipoVenta: ordenData.ventaDto.tipoVenta,
        LotesIds: ordenData.ventaDto.lotesIds,
        Id_Cliente: ordenData.ventaDto.idCliente,
        Id_Rancho: ordenData.ventaDto.idRancho
      })
    });
    
    return response;
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
        TipoVenta: ordenData.ventaDto.tipoVenta,
        ActualizarRemoEnLotes: true // Nueva bandera para actualizar REMO
      })
    });
    
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