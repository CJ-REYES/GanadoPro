// src/services/ClientesService.js
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

// Función para filtrar solo los clientes con rol "Cliente" o "Cliente/Comprador"
const filterClientes = (clientes) => {
  return clientes.filter(cliente => cliente.Rol === "Cliente" || cliente.Rol === "Cliente/Comprador");
};

// Función para transformar datos recibidos a formato consistente
const transformCliente = (cliente) => {
  return {
    Id_Cliente: cliente.Id_Cliente,
    Id_User: cliente.Id_User,
    Name: cliente.Name,
    Propietario: cliente.Propietario,
    Domicilio: cliente.Domicilio,
    Localidad: cliente.Localidad,
    Municipio: cliente.Municipio,
    Entidad: cliente.Entidad,
    Upp: cliente.Upp,
    Rol: cliente.Rol
  };
};

export const getClientes = async () => {
  const data = await fetchWithAuth(API_URL);
  const clientes = filterClientes(data);
  return clientes.map(transformCliente);
};

export const getClienteById = async (id) => {
  const data = await fetchWithAuth(`${API_URL}/${id}`);
  if (data.Rol !== "Cliente" && data.Rol !== "Cliente/Comprador") {
    throw new Error("El ID no corresponde a un comprador");
  }
  return transformCliente(data);
};

export const createCliente = async (clienteData) => {
  const dataToSend = {
    ...clienteData,
    Rol: "Cliente"  // Consistente con el filtro
  };

  const data = await fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify(dataToSend),
  });
  return transformCliente(data);
};


export const updateCliente = async (id, clienteData) => {
  const dataToSend = {
    ...clienteData,
    Rol: "Cliente" // Consistente
  };

  const data = await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dataToSend),
  });
  return data ? transformCliente(data) : null;
};

export const deleteCliente = async (id) => {
  // No es necesario validar el cliente antes de eliminar,
  // pero si quieres mantenerlo, asegúrate que la variable esté bien escrita
  // const cliente = await getClienteById(id);
  // if (!cliente) throw new Error("Cliente no encontrado");

  await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return id;
};

// Obtener lista simple de clientes con solo Id y Nombre
export const getClientesListaSimple = async () => {
  const response = await fetchWithAuth(`${API_URL}/clientes-lista-simple`);
  return response.map(cliente => ({
    Id_Cliente: cliente.id_Cliente,
    Name: cliente.name,
    Upp: cliente.upp // Asegurar que se obtiene Upp
  }));
};
