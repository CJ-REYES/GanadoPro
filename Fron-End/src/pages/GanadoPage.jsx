import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import GanadoForm from '@/components/ganado/GanadoForm';
import GanadoTable from '@/components/ganado/GanadoTable';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

const GanadoPage = () => {
  const { toast } = useToast();
  const { token, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [ganado, setGanado] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [viewingAnimal, setViewingAnimal] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [ranchos, setRanchos] = useState([]);

  const getAuthHeaders = () => {
    // Usar token del contexto o recuperar de localStorage
    const authToken = token || localStorage.getItem('authToken');
    
    if (!authToken) {
      toast({
        title: "Sesión expirada",
        description: "Por favor inicia sesión nuevamente",
        variant: "destructive"
      });
      logout();
      return {};
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };
  };

  const fetchRanchos = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5201/api/Ranchos', {
        headers
      });
      
      if (response.status === 401) {
        throw new Error('Token inválido o expirado');
      }
      
      if (!response.ok) throw new Error('Error al cargar ranchos');
      
      const data = await response.json();
      setRanchos(data);
    } catch (error) {
      if (error.message === 'Token inválido o expirado') {
        logout();
      }
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const fetchGanado = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5201/api/Animales', {
        headers
      });
      
      if (response.status === 401) {
        throw new Error('Token inválido o expirado');
      }
      
      if (!response.ok) throw new Error('Error al cargar ganado');
      
      const data = await response.json();
      setGanado(data);
    } catch (error) {
      if (error.message === 'Token inválido o expirado') {
        logout();
      }
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRanchos();
    fetchGanado();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      const method = editingAnimal ? 'PUT' : 'POST';
      const url = editingAnimal 
        ? `http://localhost:5201/api/Animales/${editingAnimal.id}`
        : 'http://localhost:5201/api/Animales';

      const payload = {
        Arete: formData.arete,
        Raza: formData.raza,
        Sexo: formData.sexo,
        Peso: formData.peso ? Number(formData.peso) : null,
        Clasificacion: formData.clasificacion,
        Edad_Meses: formData.edad ? Number(formData.edad) : 0,
        Observaciones: formData.observaciones || null,
        FechaIngreso: formData.fechaIngreso,
        Id_Rancho: Number(formData.idRancho),
        Id_Lote: formData.idLote ? Number(formData.idLote) : null,
        Estado: formData.estado || "EnStock"
      };

      const headers = getAuthHeaders();
      if (!headers.Authorization) return;
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        throw new Error('Token inválido o expirado');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || 'Error al guardar');
      }

      toast({
        title: "Éxito",
        description: editingAnimal 
          ? "Animal actualizado" 
          : "Animal registrado",
      });

      setIsFormOpen(false);
      fetchGanado();
    } catch (error) {
      if (error.message === 'Token inválido o expirado') {
        logout();
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  const handleDeleteAnimal = async (animalId) => {
    if (window.confirm('¿Eliminar este animal?')) {
      try {
        const headers = getAuthHeaders();
        if (!headers.Authorization) return;
        
        const response = await fetch(`http://localhost:5201/api/Animales/${animalId}`, {
          method: 'DELETE',
          headers
        });

        if (response.status === 401) {
          throw new Error('Token inválido o expirado');
        }
        
        if (!response.ok) throw new Error('Error al eliminar');
        
        toast({ title: "Éxito", description: "Animal eliminado" });
        fetchGanado();
      } catch (error) {
        if (error.message === 'Token inválido o expirado') {
          logout();
        } else {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      }
    }
  };

  const openEditForm = (animal) => {
    setEditingAnimal({
      id: animal.Id_Animal,
      idRancho: animal.Id_Rancho?.toString() || '',
      arete: animal.Arete,
      raza: animal.Raza,
      sexo: animal.Sexo,
      edad: animal.Edad_Meses?.toString() || '',
      peso: animal.Peso?.toString() || '',
      idLote: animal.Id_Lote?.toString() || '',
      clasificacion: animal.Clasificacion,
      estado: animal.Estado,
      fechaIngreso: animal.FechaIngreso ? new Date(animal.FechaIngreso).toISOString().split('T')[0] : '',
      observaciones: animal.Observaciones
    });
    setIsFormOpen(true);
  };

  const openViewDialog = (animal) => {
    setViewingAnimal({
      id: animal.Id_Animal,
      arete: animal.Arete,
      raza: animal.Raza,
      sexo: animal.Sexo,
      edad: animal.Edad_Meses ? `${animal.Edad_Meses} meses` : 'N/A',
      peso: animal.Peso ? `${animal.Peso} kg` : 'N/A',
      lote: animal.Id_Lote ? `Lote ${animal.Id_Lote}` : 'Sin lote',
      estado: animal.Estado,
      clasificacion: animal.Clasificacion,
      fechaIngreso: animal.FechaIngreso ? new Date(animal.FechaIngreso).toLocaleDateString() : 'N/A',
      observaciones: animal.Observaciones,
      nombreRancho: animal.NombreRancho || 'N/A'
    });
    setIsViewDialogOpen(true);
  };

  const filterGanado = (list) => {
    if (!searchTerm) return list;
    return list.filter(animal => 
      Object.values(animal).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const machos = filterGanado(ganado.filter(g => g.Sexo === 'Macho'));
  const hembras = filterGanado(ganado.filter(g => g.Sexo === 'Hembra'));
  
  const mapToTableData = (data) => data.map(animal => ({
    Id_Animal: animal.Id_Animal,
    Arete: animal.Arete,
    Raza: animal.Raza,
    Sexo: animal.Sexo,
    Edad_Meses: animal.Edad_Meses || 'N/A',
    Peso: animal.Peso ? `${animal.Peso} kg` : 'N/A',
    Id_Lote: animal.Id_Lote ? `Lote ${animal.Id_Lote}` : 'Sin lote',
    Estado: animal.Estado,
    Clasificacion: animal.Clasificacion,
    FechaIngreso: animal.FechaIngreso ? new Date(animal.FechaIngreso).toLocaleDateString() : 'N/A',
    Observaciones: animal.Observaciones,
    NombreRancho: animal.NombreRancho || 'N/A'
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Gestión de Ganado
        </h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all">
              <PlusCircle className="mr-2 h-4 w-4" /> Registrar Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAnimal ? 'Editar Animal' : 'Registrar Nuevo Animal'}</DialogTitle>
              <DialogDescription>
                {editingAnimal ? `Actualizando ${editingAnimal.arete}` : 'Registre un nuevo animal'}
              </DialogDescription>
            </DialogHeader>
            <GanadoForm 
              animal={editingAnimal} 
              ranchos={ranchos}
              onSuccess={() => {
                setIsFormOpen(false);
                fetchGanado();
              }}
              onCancel={() => setIsFormOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/60 backdrop-blur-md p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar por arete, raza, lote..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['EnStock', 'Vendido', 'EnProceso'].map(estado => (
                <DropdownMenuCheckboxItem key={estado}>
                  {estado}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando datos del ganado...</p>
        </div>
      ) : (
        <Tabs defaultValue="machos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="machos">Machos ({machos.length})</TabsTrigger>
            <TabsTrigger value="hembras">Hembras ({hembras.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="machos">
            <GanadoTable 
              data={mapToTableData(machos)} 
              title="Machos" 
              onView={openViewDialog} 
              onEdit={openEditForm} 
              onDelete={handleDeleteAnimal} 
            />
          </TabsContent>
          <TabsContent value="hembras">
            <GanadoTable 
              data={mapToTableData(hembras)} 
              title="Hembras" 
              onView={openViewDialog} 
              onEdit={openEditForm} 
              onDelete={handleDeleteAnimal} 
            />
          </TabsContent>
        </Tabs>
      )}

      {viewingAnimal && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles: {viewingAnimal.arete}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2 py-4 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <strong>Arete:</strong> <p>{viewingAnimal.arete}</p>
                <strong>Raza:</strong> <p>{viewingAnimal.raza}</p>
                <strong>Sexo:</strong> <p>{viewingAnimal.sexo}</p>
                <strong>Edad:</strong> <p>{viewingAnimal.edad}</p>
                <strong>Peso:</strong> <p>{viewingAnimal.peso}</p>
                <strong>Lote:</strong> <p>{viewingAnimal.lote}</p>
                <strong>Estado:</strong> <p>{viewingAnimal.estado}</p>
                <strong>Clasificación:</strong> <p>{viewingAnimal.clasificacion}</p>
                <strong>Rancho:</strong> <p>{viewingAnimal.nombreRancho}</p>
                <strong>Fecha Ingreso:</strong> <p>{viewingAnimal.fechaIngreso}</p>
              </div>
              {viewingAnimal.observaciones && (
                <>
                  <Separator className="my-2" />
                  <strong>Observaciones:</strong> 
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingAnimal.observaciones}</p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default GanadoPage;