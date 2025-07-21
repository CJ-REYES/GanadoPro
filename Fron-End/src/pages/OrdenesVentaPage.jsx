// src/pages/OrdenesVentaPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, FileText, Truck, CheckCircle, XCircle, Clock, Edit, Trash2, Loader2, Search
} from 'lucide-react'; // Añadido Search aquí
import { Input } from '@/components/ui/input'; // Añadido import de Input
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
  
  // Cargar órdenes
  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const data = await ventasService.getOrdenesVenta();
      
      // Transformar fechas a objetos Date
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

 // Filtrar órdenes
  const filteredOrdenes = useMemo(() => {
    return ordenes.filter(orden => {
      // Búsqueda por términos (CORRECCIÓN: quitamos paréntesis innecesarios)
      const matchesSearch = 
        orden.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        orden.upp?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        orden.folioGuiaRemo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por estado
      const matchesStatus = filterStatus.length === 0 || filterStatus.includes(orden.estado);
      
      return matchesSearch && matchesStatus;
    });
  }, [ordenes, searchTerm, filterStatus]);
  // Crear categorías de órdenes
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

  // Manejar creación exitosa de orden
  const handleSaveSuccess = (nuevaOrden) => {
    if (nuevaOrden) {
      // Actualizar estado local con la nueva orden
      setOrdenes(prev => {
        // Si es una edición, reemplazar la orden existente
        if (currentOrden) {
          return prev.map(o => o.id === nuevaOrden.id ? nuevaOrden : o);
        }
        // Si es nueva, agregar al principio
        return [nuevaOrden, ...prev];
      });
      
      toast({ description: "Orden creada exitosamente" });
    } else {
      // Si no recibimos la nueva orden, recargar todo
      cargarOrdenes();
    }
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta orden?')) {
      try {
        await ventasService.deleteOrdenVenta(id);
        // Eliminar localmente sin recargar todo
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
                  <TableCell>{orden.totalAnimales}</TableCell>
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
      
      {/* Barra de búsqueda y filtros */}
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
          
          {/* Filtros por estado */}
          
        </div>
      </Card>
      
      {/* Pestañas de tipos de venta */}
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
    </motion.div>
  );
};

export default OrdenesVentaPage;