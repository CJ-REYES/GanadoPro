// src/services/ganadoService.js
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
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  return response.json();
};

const transformAnimal = (animal) => ({
  id_Animal: animal.Id_Animal,
  arete: animal.Arete,
  peso: animal.Peso,
  sexo: animal.Sexo,
  clasificacion: animal.Clasificacion,
  raza: animal.Raza,
  edad_Meses: animal.Edad_Meses,
  foliGuiaRemoEntrada: animal.FoliGuiaRemoEntrada,
  foliGuiaRemoSalida: animal.FoliGuiaRemoSalida,
  uppOrigen: animal.UppOrigen,
  uppDestino: animal.UppDestino,
  fechaIngreso: animal.FechaIngreso,
  fechaSalida: animal.FechaSalida,
  motivoSalida: animal.MotivoSalida,
  observaciones: animal.Observaciones,
  certificadoZootanitario: animal.CertificadoZootanitario,
  contanciaGarrapaticida: animal.ContanciaGarrapaticida,
  folioTB: animal.FolioTB,
  validacionConside_ID: animal.ValidacionConside_ID,
  fierroCliente: animal.FierroCliente,
  razonSocial: animal.RazonSocial,
  estado: animal.Estado,
  id_Lote: animal.Id_Lote,
  id_Rancho: animal.Id_Rancho,
  id_Cliente: animal.Id_Cliente,
  nombreRancho: animal.NombreRancho,
});

export const getAnimales = async () => {
  const data = await fetchWithAuth(API_URL);
  return data.map(transformAnimal);
};

export const getAnimalesComprados = async () => {
  const data = await fetchWithAuth(`${API_URL}/comprados`);
  return data.map(transformAnimal);
};

export const getAnimalById = async (id) => {
  const data = await fetchWithAuth(`${API_URL}/${id}`);
  return transformAnimal(data);
};

export const createAnimal = async (animalData) => {
  const data = await fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify(animalData),
  });
  return transformAnimal(data);
};

export const updateAnimal = async (id, animalData) => {
  await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(animalData),
  });
  return true;
};

export const deleteAnimal = async (id) => {
  await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return id;
};

export const asignarLote = async (idLote, idsAnimales) => {
  await fetchWithAuth(`${API_URL}/asignar-lote`, {
    method: 'PUT',
    body: JSON.stringify({
      Id_Lote: idLote,
      Ids_Animales: idsAnimales,
    }),
  });
  return true;
};
