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

const GanadoPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [ganado, setGanado] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [viewingAnimal, setViewingAnimal] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Cargar datos de la API
  const fetchGanado = async () => {
    try {
      const response = await fetch('http://localhost:5201/api/Animales');
      if (!response.ok) {
        throw new Error('Error al cargar los datos del ganado');
      }
      const data = await response.json();
      setGanado(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
        Clasificacion: formData.estado,
        Categoria: formData.edad || null,
        Origen: formData.notas || null,
        FechaCompra: formData.fechaCompra,
        Id_Rancho: Number(formData.idRancho),
        Id_Lote: formData.corral ? Number(formData.corral) : null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || errorData.message || 'Error al guardar el animal');
      }

      toast({
        title: "Éxito",
        description: editingAnimal 
          ? "Animal actualizado correctamente" 
          : "Animal registrado correctamente",
      });

      setIsFormOpen(false);
      fetchGanado(); // Recargar datos
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnimal = async (animalId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este animal?')) {
      try {
        const response = await fetch(`http://localhost:5201/api/Animales/${animalId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el animal');
        }

        toast({
          title: "Éxito",
          description: "Animal eliminado correctamente",
        });

        fetchGanado(); // Recargar datos
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const openEditForm = (animal) => {
    // Mapear los datos de la API al formato que espera el formulario
    setEditingAnimal({
      id: animal.id,
      idRancho: animal.id_Rancho?.toString() || '',
      arete: animal.arete,
      raza: animal.raza,
      sexo: animal.sexo,
      edad: animal.categoria,
      peso: animal.peso?.toString() || '',
      lote: animal.id_Lote?.toString() || '',
      estado: animal.clasificacion,
      fechaCompra: animal.fechaCompra,
      notas: animal.origen
    });
    setIsFormOpen(true);
  };

  const openViewDialog = (animal) => {
    setViewingAnimal({
      id: animal.id_Animal,
      arete: animal.arete,
      raza: animal.raza,
      sexo: animal.sexo,
      edad: animal.categoria || 'N/A',
      peso: animal.peso ? `${animal.peso} kg` : 'N/A',
      lote: animal.id_Lote || 'N/A',
      estado: animal.clasificacion,
      fechaRegistro: animal.fechaCompra,
      notas: animal.origen
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

  // Filtrar datos para las pestañas
  const machos = filterGanado(ganado.filter(g => g.sexo === 'Macho'));
  const hembras = filterGanado(ganado.filter(g => g.sexo === 'Hembra'));
// mapear los datos al formato de la tabla
const mapToTableData = (data) => data.map(animal => ({
  id: animal.id_Animal, // ← Exactamente como viene en los datos (con mayúscula)
  arete: animal.arete,
  raza: animal.raza,
  sexo: animal.sexo,
  edad: animal.categoria || 'N/A',
  peso: animal.peso ? `${animal.peso} kg` : 'N/A',
  corral: animal.id_lote || 'N/A', // ← Nota que es id_lote (minúscula)
  estado: animal.clasificacion,
  fechaRegistro: animal.fechaCompra,
  notas: animal.origen
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
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) setEditingAnimal(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all">
              <PlusCircle className="mr-2 h-4 w-4" /> Registrar Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAnimal ? 'Editar Animal' : 'Registrar Nuevo Animal'}</DialogTitle>
              <DialogDescription>
                {editingAnimal ? `Actualiza los detalles del animal ${editingAnimal.arete}.` : 'Completa la información para registrar un nuevo animal en el sistema.'}
              </DialogDescription>
            </DialogHeader>
            <GanadoForm 
              animal={editingAnimal} 
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
              placeholder="Buscar por arete, raza, corral, estado..." 
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
              {['Saludable', 'Enfermo', 'Preñada', 'En engorde', 'Cuarentena'].map(estado => (
                <DropdownMenuCheckboxItem 
                  key={estado} 
                  onCheckedChange={() => { /* Implementar lógica de filtrado si es necesario */ }}
                >
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
              title="Lista de Ganado - Machos" 
              onView={openViewDialog} 
              onEdit={openEditForm} 
              onDelete={handleDeleteAnimal} 
            />
          </TabsContent>
          <TabsContent value="hembras">
            <GanadoTable 
              data={mapToTableData(hembras)} 
              title="Lista de Ganado - Hembras" 
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
              <DialogTitle>Detalles del Animal: {viewingAnimal.id} ({viewingAnimal.identificador})</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2 py-4 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <strong>Raza:</strong> <p>{viewingAnimal.raza}</p>
                <strong>Sexo:</strong> <p>{viewingAnimal.sexo}</p>
                <strong>Edad:</strong> <p>{viewingAnimal.edad}</p>
                <strong>Peso:</strong> <p>{viewingAnimal.peso}</p>
                <strong>Corral:</strong> <p>{viewingAnimal.corral}</p>
                <strong>Estado:</strong> <p>{viewingAnimal.estado}</p>
                <strong>Fecha Registro:</strong> <p>{viewingAnimal.fechaRegistro}</p>
              </div>
              {viewingAnimal.notas && (
                <>
                  <Separator className="my-2" />
                  <strong>Notas:</strong> 
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingAnimal.notas}</p>
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