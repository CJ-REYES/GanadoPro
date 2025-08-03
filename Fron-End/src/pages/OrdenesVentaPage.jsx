// src/pages/OrdenesVentaPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, FileText, Truck, CheckCircle, XCircle, Clock, Edit, Trash2, Loader2, Search, ChevronDown, ChevronUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import FormOrdenVenta from '@/components/FormOrdenVenta';
import * as ventasService from '@/services/ventasService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const getStatusIconAndColor = (status) => {
  switch (status) {
    case 'Pendiente de Pago': return { icon: <Clock className="h-4 w-4 mr-2 text-yellow-500" />, color: 'text-yellow-500 bg-yellow-500/10' };
    case 'En Preparación': return { icon: <Truck className="h-4 w-4 mr-2 text-blue-500" />, color: 'text-blue-500 bg-blue-500/10' };
    case 'Entregado': return { icon: <CheckCircle className="h-4 w-4 mr-2 text-green-500" />, color: 'text-green-500 bg-green-500/10' };
    case 'En Tránsito': return { icon: <Truck className="h-4 w-4 mr-2 text-purple-500" />, color: 'text-purple-500 bg-purple-500/10 animate-pulse' };
    case 'Cancelado': return { icon: <XCircle className="h-4 w-4 mr-2 text-red-500" />, color: 'text-red-500 bg-red-500/10' };
    default: return { icon: <FileText className="h-4 w-4 mr-2 text-gray-500" />, color: 'text-gray-500 bg-gray-500/10' };
  }
};

const OrdenesVentaPage = () => {
  const { toast } = useToast();
  const [ordenes, setOrdenes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrden, setCurrentOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState([]);
  
  const [isLotesModalOpen, setIsLotesModalOpen] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [expandedLotes, setExpandedLotes] = useState({});
  const [animalesLoading, setAnimalesLoading] = useState({});

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const data = await ventasService.getOrdenesVenta();
      
      const ordenesTransformadas = data.map(orden => ({
        ...orden,
        fechaSalida: orden.fechaSalida instanceof Date 
          ? orden.fechaSalida 
          : new Date(orden.fechaSalida)
      }));
      
      setOrdenes(ordenesTransformadas);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      toast({
        title: "Error",
        description: "Error al cargar las órdenes: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const filteredOrdenes = useMemo(() => {
    return ordenes.filter(orden => {
      const matchesSearch = 
        orden.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        orden.upp?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        orden.folioGuiaRemo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus.length === 0 || filterStatus.includes(orden.estado);
      
      return matchesSearch && matchesStatus;
    });
  }, [ordenes, searchTerm, filterStatus]);

  const nacionales = useMemo(() => 
    filteredOrdenes.filter(o => o.tipoVenta === 'Nacional'), 
    [filteredOrdenes]
  );
  
  const internacionales = useMemo(() => 
    filteredOrdenes.filter(o => o.tipoVenta === 'Internacional'), 
    [filteredOrdenes]
  );
  
  const todas = useMemo(() => filteredOrdenes, [filteredOrdenes]);

  const handleOpenModal = (orden = null) => {
    setCurrentOrden(orden);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentOrden(null);
  };

  // SOLUCIÓN: Recargar las órdenes después de crear/actualizar
  const handleSaveSuccess = () => {
    cargarOrdenes();
    toast({ 
      description: currentOrden ? "Orden actualizada exitosamente" : "Orden creada exitosamente" 
    });
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta orden?')) {
      try {
        await ventasService.deleteOrdenVenta(id);
        setOrdenes(prev => prev.filter(o => o.id !== id));
        toast({ description: "Orden eliminada correctamente" });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la orden",
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenLotesModal = (orden) => {
    setSelectedOrden(orden);
    setIsLotesModalOpen(true);
    setExpandedLotes({});
    setAnimalesLoading({});
  };

  const toggleExpandLote = async (loteId) => {
    const newExpandedLotes = { ...expandedLotes };
    const key = loteId;
    
    if (newExpandedLotes[key]) {
      delete newExpandedLotes[key];
    } else {
      newExpandedLotes[key] = true;
      
      if (!selectedOrden.lotes.find(l => l.id === loteId)?.animales) {
        try {
          setAnimalesLoading(prev => ({ ...prev, [key]: true }));
          const animales = await ventasService.getAnimalesLote(loteId);
          
          setSelectedOrden(prev => ({
            ...prev,
            lotes: prev.lotes.map(lote => 
              lote.id === loteId 
                ? { ...lote, animales } 
                : lote
            )
          }));
        } catch (error) {
          toast({
            title: "Error al cargar animales",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setAnimalesLoading(prev => ({ ...prev, [key]: false }));
        }
      }
    }
    
    setExpandedLotes(newExpandedLotes);
  };

  const OrdenesTable = ({ data, title }) => (
    <Card className="bg-card/80 backdrop-blur-sm mt-4">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">{title} ({data.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No hay órdenes en esta categoría.</p>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Orden</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Animales</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((orden) => {
              const { icon, color } = getStatusIconAndColor(orden.estado);
              return (
                <TableRow key={orden.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">OV-{orden.id}</TableCell>
                  <TableCell>
                    {orden.fechaSalida.toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={orden.cliente}>
                    {orden.cliente}
                    <div className="text-xs text-muted-foreground">{orden.upp}</div>
                  </TableCell>
                  <TableCell>{orden.totalAnimales}
                  </TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-1 text-xs rounded-full flex items-center", color)}>
                      {icon} {orden.estado}
                    </span>
                  </TableCell>
                  <TableCell style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', textAlign: 'right' }}>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleOpenModal(orden)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDelete(orden.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      onClick={() => handleOpenLotesModal(orden)}
                      className="h-8 w-8"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Órdenes de Venta
        </h1>
        <Button 
          className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all"
          onClick={() => handleOpenModal()}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Nueva Orden de Venta
        </Button>
      </div>
      
      <Card className="bg-card/60 backdrop-blur-md p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar por cliente, UPP, folio..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="todas" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="todas">Todas las Órdenes</TabsTrigger>
          <TabsTrigger value="nacionales">Ventas Nacionales</TabsTrigger>
          <TabsTrigger value="internacionales">Ventas Internacionales</TabsTrigger>
        </TabsList>
        <TabsContent value="todas">
          <OrdenesTable data={todas} title="Todas las Órdenes de Venta" />
        </TabsContent>
        <TabsContent value="nacionales">
          <OrdenesTable data={nacionales} title="Órdenes de Venta Nacionales" />
        </TabsContent>
        <TabsContent value="internacionales">
          <OrdenesTable data={internacionales} title="Órdenes de Venta Internacionales" />
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentOrden ? 'Editar Orden de Venta' : 'Nueva Orden de Venta'}
            </DialogTitle>
          </DialogHeader>
          <FormOrdenVenta 
            orden={currentOrden} 
            onClose={handleCloseModal} 
            onSave={handleSaveSuccess} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isLotesModalOpen} onOpenChange={() => setIsLotesModalOpen(false)}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              Detalles de Lotes - Orden OV-{selectedOrden?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrden && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Folio Guía Remo</h4>
                  <p>{selectedOrden.folioGuiaRemo}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Fecha de Salida</h4>
                  <p>
                    {selectedOrden.fechaSalida.toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Estado</h4>
                  <span className={cn("px-2 py-1 text-xs rounded-full flex items-center", getStatusIconAndColor(selectedOrden.estado).color)}>
                    {selectedOrden.estado}
                  </span>
                </div>
              </div>
              
              <h4 className="font-semibold mb-3">Lotes</h4>
              <div className="space-y-3">
                {selectedOrden.lotes.map((lote) => (
                  <div key={lote.id} className="border rounded-lg overflow-hidden">
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleExpandLote(lote.id)}
                    >
                      <div className="space-y-1">
                        <div className="font-semibold">Lote #{lote.remO}</div>
                        <div className="text-sm text-muted-foreground">
                          Comunidad: {lote.comunidad} | Animales: {lote.cantidadAnimales}
                        </div>
                      </div>
                      <div>
                        <Button variant="ghost" size="icon">
                          {expandedLotes[lote.id] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {expandedLotes[lote.id] && (
                      <div className="border-t">
                        {animalesLoading[lote.id] ? (
                          <div className="p-4 flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : (
                          <div className="p-4 overflow-x-auto">
                            {lote.animales?.length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Arete</TableHead>
                                    <TableHead>Raza</TableHead>
                                    <TableHead>Peso</TableHead>
                                    <TableHead>Sexo</TableHead>
                                    <TableHead>Fecha salida</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {lote.animales.map((animal) => (
                                    <TableRow key={animal.id_Animal}>
                                      <TableCell>{animal.id_Animal}</TableCell>
                                      <TableCell>{animal.arete}</TableCell>
                                      <TableCell>{animal.raza}</TableCell>
                                      <TableCell>{animal.peso} kg</TableCell>
                                      <TableCell>{animal.sexo}</TableCell>
                                      <TableCell>
                                        {animal.fechaSalida ? animal.fechaSalida.toLocaleDateString() : 'N/A'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <p className="text-center text-muted-foreground py-4">
                                No hay animales registrados en este lote
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OrdenesVentaPage;