// src/components/FormOrdenVenta.jsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createOrdenVenta, updateOrdenVenta, getLotesDisponibles } from "@/services/ventasService";
import { getClientesListaSimple } from "@/services/ClientesService";
import { getRanchosByUser } from "@/services/ranchoService";
import { toast } from 'react-toastify';

const FormOrdenVenta = ({ onClose, onSave, orden }) => {
  const [fechaSalida, setFechaSalida] = useState(new Date());
  const [folioGuiaRemo, setFolioGuiaRemo] = useState('');
  const [tipoVenta, setTipoVenta] = useState('');
  const [cliente, setCliente] = useState(null);
  const [upp, setUpp] = useState('');
  const [clientes, setClientes] = useState([]);
  const [lotesDisponibles, setLotesDisponibles] = useState([]);
  const [lotesSeleccionados, setLotesSeleccionados] = useState([]);
  const [ranchos, setRanchos] = useState([]);
  const [ranchoSeleccionado, setRanchoSeleccionado] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [clientesData, lotesData, ranchosData] = await Promise.all([
          getClientesListaSimple(),
          getLotesDisponibles(),
          getRanchosByUser()
        ]);
        setClientes(clientesData);
        setLotesDisponibles(lotesData);
        setRanchos(ranchosData);

        if (ranchosData.length > 0) {
          setRanchoSeleccionado(ranchosData[0].id_Rancho);
        }
      } catch (err) {
        setError('Error al cargar datos iniciales: ' + err.message);
        toast.error('Error al cargar datos iniciales');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (orden) {
      setFechaSalida(new Date(orden.fechaSalida));
      setFolioGuiaRemo(orden.folioGuiaRemo || '');
      setTipoVenta(orden.tipoVenta || '');
      setUpp(orden.upp || '');
      setCliente({ Id_Cliente: orden.idCliente, Name: orden.cliente });
      setLotesSeleccionados(orden.lotes.map(l => l.id));
      setRanchoSeleccionado(orden.idRancho);
    }
  }, [orden]);

  const handleClienteChange = (e) => {
    const idCliente = parseInt(e.target.value);
    const clienteSeleccionado = clientes.find(c => c.Id_Cliente === idCliente);
    if (clienteSeleccionado) {
      setCliente(clienteSeleccionado);
      setUpp(clienteSeleccionado.Upp || '');
    } else {
      setCliente(null);
      setUpp('');
    }
  };

  const handleUppChange = (e) => {
    const uppValue = e.target.value;
    setUpp(uppValue);
    const clienteEncontrado = clientes.find(c =>
      c.Upp && c.Upp.toLowerCase() === uppValue.toLowerCase()
    );
    if (clienteEncontrado) setCliente(clienteEncontrado);
  };

  const handleLoteSeleccionado = (idLote) => {
    setLotesSeleccionados(prev =>
      prev.includes(idLote)
        ? prev.filter(id => id !== idLote)
        : [...prev, idLote]
    );
  };

  const seleccionarTodosLotes = () => {
    setLotesSeleccionados(
      lotesSeleccionados.length === lotesDisponibles.length
        ? []
        : lotesDisponibles.map(lote => lote.id_Lote)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcesando(true);

    const errores = [];
    if (!tipoVenta) errores.push('Tipo de venta obligatorio');
    if (!folioGuiaRemo) errores.push('Folio guía remo obligatorio');
    if (!cliente) errores.push('Debe seleccionar cliente');
    if (lotesSeleccionados.length === 0) errores.push('Debe seleccionar al menos un lote');
    if (!ranchoSeleccionado) errores.push('Debe seleccionar un rancho');

    if (errores.length > 0) {
      setError(errores.join(', '));
      setProcesando(false);
      return;
    }

    try {
      let respuesta;
      
      // Convertir tipoVenta a número
      const tipoVentaNum = tipoVenta === 'Nacional' ? 0 : 1;
      
      // Estructura ventaDto requerida por backend
      const requestData = {
        ventaDto: {
          fechaSalida,
          folioGuiaRemo,
          tipoVenta: tipoVentaNum,
          lotesIds: lotesSeleccionados,
          idCliente: cliente.Id_Cliente,
          upp,
          idRancho: ranchoSeleccionado
        }
      };

      if (orden) {
        respuesta = await updateOrdenVenta(orden.id, requestData);
        
        // Si la respuesta es nula (204 No Content), usar los datos locales
        if (!respuesta) {
          respuesta = {
            ...orden,
            fechaSalida,
            folioGuiaRemo,
            tipoVenta,
            idCliente: cliente.Id_Cliente,
            cliente: cliente.Name,
            upp,
            idRancho: ranchoSeleccionado,
            lotes: lotesDisponibles.filter(l => lotesSeleccionados.includes(l.id_Lote))
          };
        }
        
        toast.success('Orden actualizada');
      } else {
        respuesta = await createOrdenVenta(requestData);
        toast.success('Orden creada');
      }

      if (typeof onSave === 'function') onSave(respuesta);
    } catch (err) {
      toast.error(err.message || 'Error al procesar');
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden">
      {/* Encabezado con gradiente */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6">
        <h2 className="text-2xl font-bold">
          {orden ? 'Editar Orden de Venta' : 'Nueva Orden de Venta'}
        </h2>
        <p className="text-blue-200 text-sm mt-1">
          {orden ? 'Modifica los detalles de la orden existente' : 'Completa todos los campos para crear una nueva orden'}
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-300 p-4 mb-6 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Columna Izquierda */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Venta <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={tipoVenta}
                  onChange={(e) => setTipoVenta(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-gray-800 text-white"
                >
                  <option value="">Seleccionar tipo de venta</option>
                  <option value="Nacional">Nacional</option>
                  <option value="Internacional">Internacional</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">Seleccionar el tipo de venta</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha de Salida <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={fechaSalida}
                  onChange={(date) => setFechaSalida(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">Seleccionar la fecha de salida del ganado</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rancho <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={ranchoSeleccionado}
                  onChange={(e) => setRanchoSeleccionado(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-gray-800 text-white"
                >
                  {ranchos.map(r => (
                    <option key={r.id_Rancho} value={r.id_Rancho}>{r.nombreRancho}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">Seleccionar el rancho de origen</p>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Folio Guía Remo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={folioGuiaRemo}
                onChange={(e) => setFolioGuiaRemo(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                placeholder="Ingrese el folio guía"
              />
              <p className="mt-1 text-xs text-gray-400">Número oficial de guía de remoción (C24:6:02:05)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cliente <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={cliente?.Id_Cliente || ''}
                  onChange={handleClienteChange}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-gray-800 text-white"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(c => (
                    <option key={c.Id_Cliente} value={c.Id_Cliente}>{c.Name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">Seleccionar un cliente de la lista</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                UPP (Unidad de Producción Pecuaria) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={upp}
                onChange={handleUppChange}
                className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                placeholder="Ingrese el UPP"
              />
              <p className="mt-1 text-xs text-gray-400">Identificador único del cliente (C24:6:03:05)</p>
            </div>
          </div>
        </div>

        {/* Sección de Lotes */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-300">
              Lotes Disponibles <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={seleccionarTodosLotes}
              className="text-blue-400 text-sm font-medium hover:text-blue-300"
            >
              {lotesSeleccionados.length === lotesDisponibles.length
                ? 'Deseleccionar todos'
                : 'Seleccionar todos'}
            </button>
          </div>
          
          <div className="border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-800">
            {lotesDisponibles.length === 0 ? (
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="mt-2 text-sm text-gray-400">No hay lotes disponibles para venta</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lotesDisponibles.map(lote => (
                  <div 
                    key={lote.id_Lote} 
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      lotesSeleccionados.includes(lote.id_Lote) 
                        ? 'border-blue-500 bg-blue-900/20' 
                        : 'border-gray-700 hover:border-blue-500'
                    }`}
                    onClick={() => handleLoteSeleccionado(lote.id_Lote)}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mt-0.5 ${
                        lotesSeleccionados.includes(lote.id_Lote)
                          ? 'bg-blue-500 border-blue-400'
                          : 'bg-gray-800 border-gray-500'
                      }`}>
                        {lotesSeleccionados.includes(lote.id_Lote) && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                          {lote.comunidad}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {lote.cantidadAnimales} animales
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contador de lotes seleccionados */}
        <div className="bg-blue-900/30 border border-blue-800 rounded-lg px-4 py-3 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-blue-300">
              {lotesSeleccionados.length} {lotesSeleccionados.length === 1 ? 'lote seleccionado' : 'lotes seleccionados'}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 border-t border-gray-800 pt-6">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={procesando}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {procesando ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {orden ? 'Actualizando...' : 'Creando...'}
              </div>
            ) : (
              orden ? 'Actualizar' : 'Crear'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormOrdenVenta;