// LotesPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter, ChevronDown, Edit, Trash2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter, // <-- Agrega esta línea
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getToken } from '@/hooks/useToken';
import useLocalStorage from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import * as loteService from '@/services/loteService';
import * as ranchoService from '@/services/ranchoService';
import * as animalService from '@/services/animalService';
import LoteForm from '@/components/LoteForm';

const LoteAccordion = ({ lote, onEdit, onDelete, onForceDelete, onRemoveAnimal }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const getStatusClass = (estado) => {
    return cn(`px-2 py-1 text-xs rounded-full`,
      estado === 'Disponible' && 'bg-green-500/20 text-green-400',
      estado === 'Vendido' && 'bg-gray-500/20 text-gray-400',
      estado === 'En proceso de venta' && 'bg-yellow-500/20 text-yellow-400'
    );
  };

  const handleRemove = async (animalId) => {
    setIsRemoving(true);
    try {
      await onRemoveAnimal(animalId);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <ChevronDown className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          <div className="font-medium">Lote #{lote.remo}</div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={getStatusClass(lote.estado)}>
            {lote.estado}
          </span>
          <span className="text-sm text-muted-foreground">
            {lote.totalAnimales} animales
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(lote);
            }}
            className="text-foreground hover:text-primary"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (lote.estado === 'Vendido') {
                onForceDelete(lote.id_Lote);
              } else {
                onDelete(lote.id_Lote);
              }
            }}
            className="text-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="p-0 border-t">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Rancho</p>
                <p className="font-medium">{lote.rancho?.nombre || 'Sin rancho'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ubicación</p>
                <p className="font-medium">{lote.rancho?.ubicacion || 'Sin ubicación'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha Creación</p>
                <p className="font-medium">
                  {lote.fechaCreacion ? new Date(lote.fechaCreacion).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <h4 className="text-sm font-medium mb-3">
              Animales ({lote.totalAnimales})
            </h4>

            {lote.animales && lote.animales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Arete</th>
                      <th className="px-4 py-2 text-left">Sexo</th>
                      <th className="px-4 py-2 text-left">Edad</th>
                      <th className="px-4 py-2 text-left">Peso</th>
                      <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lote.animales.map(animal => (
                      <tr key={animal.id_Animal} className="border-b hover:bg-muted/30">
                        <td className="px-4 py-2">{animal.id_Animal}</td>
                        <td className="px-4 py-2">{animal.arete}</td>
                        <td className="px-4 py-2">
                          <span className={cn(`px-2 py-1 text-xs rounded-full`,
                            animal.sexo === 'Macho' ? 'bg-blue-500/20 text-blue-400' :
                            animal.sexo === 'Hembra' ? 'bg-pink-500/20 text-pink-400' : 'bg-gray-500/20 text-gray-400'
                          )}>
                            {animal.sexo || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-2">{animal.edad || 0} meses</td>
                        <td className="px-4 py-2">{animal.peso || 0} kg</td>
                        <td className="px-4 py-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemove(animal.id_Animal)}
                            className="text-xs"
                            disabled={isRemoving}
                          >
                            {isRemoving ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : 'Eliminar'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No hay animales en este lote
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const AssignAnimalsForm = ({ lotes, onAssign, onCancel }) => {
  const [selectedLote, setSelectedLote] = useState('');
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const data = await animalService.getAnimalesEnStock();
        const availableAnimals = data
          .filter(animal => !animal.id_Lote)
          .map(animal => ({
            ...animal,
            raza: animal.raza || 'N/A'
          }));
        setAnimals(availableAnimals);
      } catch (err) {
        setError(err.message || 'Error al cargar animales');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const toggleAnimalSelection = (animalId) => {
    setSelectedAnimals(prev =>
      prev.includes(animalId)
        ? prev.filter(id => id !== animalId)
        : [...prev, animalId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLote || selectedAnimals.length === 0) return;

    setIsAssigning(true);
    try {
      await onAssign(parseInt(selectedLote), selectedAnimals);
      onCancel();
    } catch (error) {
      // El error se maneja en la función onAssign
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredAnimals = animals.filter(animal =>
    animal.arete.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="lote" className="text-foreground">Seleccionar Lote</Label>
        <select
          id="lote"
          value={selectedLote}
          onChange={(e) => setSelectedLote(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Seleccione un lote</option>
          {lotes.map(lote => (
            <option key={`lote-${lote.id_Lote}`} value={lote.id_Lote}>
              Lote #{lote.remo} - {lote.rancho?.nombre || 'Sin rancho'}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Animales Disponibles ({animals.length})</Label>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por arete..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-destructive text-center py-4">{error}</div>
        ) : filteredAnimals.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No hay animales disponibles para asignar
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto border rounded-md p-4">
            {filteredAnimals.map(animal => (
              <div
                key={`animal-${animal.id_Animal}`}
                className={`flex items-center p-2 rounded-md ${
                  selectedAnimals.includes(animal.id_Animal)
                    ? 'bg-primary/10 border border-primary'
                    : 'hover:bg-muted/30'
                }`}
              >
                <input
                  type="checkbox"
                  id={`animal-${animal.id_Animal}`}
                  checked={selectedAnimals.includes(animal.id_Animal)}
                  onChange={() => toggleAnimalSelection(animal.id_Animal)}
                  className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`animal-${animal.id_Animal}`}
                  className="flex-1 cursor-pointer"
                >
                  <p className="font-medium">Arete: {animal.arete}</p>
                  <p className="text-sm text-muted-foreground">
                    {animal.raza} | {animal.peso} kg | {animal.edad_Meses} meses | {animal.sexo}
                  </p>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isAssigning}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!selectedLote || selectedAnimals.length === 0 || isAssigning}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isAssigning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Asignando...
            </>
          ) : 'Asignar Animales'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const LotesPage = () => {
  const { toast } = useToast();
  const [lotes, setLotes] = useState([]);
  const [ranchos, setRanchos] = useState([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingLote, setEditingLote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getToken();
  const [user] = useLocalStorage('user', null);

  const fetchRanchos = async () => {
    try {
      const data = await ranchoService.getRanchos();
      setRanchos(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const fetchLotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await loteService.getLotes('Disponible');
      setLotes(data);
    } catch (error) {
      setError(error.message);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLote = () => {
    setEditingLote(null);
    setIsEditing(false);
    setIsFormDialogOpen(true);
  };

  const handleEditLote = (lote) => {
    setEditingLote(lote);
    setIsEditing(true);
    setIsFormDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormDialogOpen(false);
    setEditingLote(null);
    setIsEditing(false);
    fetchLotes();
  };

  const handleAssignAnimals = async (loteId, animalIds) => {
    try {
      await animalService.asignarAnimalesALote(loteId, animalIds);
      toast({ title: "Éxito", description: "Animales asignados correctamente" });
      fetchLotes();
      setIsAssignDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteLote = async (loteId) => {
    if (!loteId) return;

    if (!window.confirm('¿Está seguro de que desea eliminar este lote?')) return;

    try {
      await loteService.deleteLote(loteId);
      setLotes(lotes.filter(l => l.id_Lote !== loteId));
      toast({ title: "Éxito", description: "Lote eliminado correctamente" });
    } catch (error) {
      let errorMessage = error.message;

      if (errorMessage.includes("ventas asociadas")) {
        errorMessage = "No se puede eliminar: el lote tiene ventas registradas. " +
          "¿Desea eliminar forzadamente el lote y todas sus ventas?";

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 10000,
          action: (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleForceDeleteLote(loteId)}
            >
              Eliminar forzadamente
            </Button>
          )
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  const handleForceDeleteLote = async (loteId) => {
    if (!window.confirm('¡ADVERTENCIA! Esta acción eliminará PERMANENTEMENTE el lote y TODAS sus ventas asociadas. ¿Continuar?')) return;

    try {
      await loteService.forceDeleteLote(loteId);
      setLotes(lotes.filter(l => l.id_Lote !== loteId));
      toast({
        title: "Éxito",
        description: "Lote y ventas asociadas eliminados permanentemente",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al eliminar forzadamente: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleRemoveAnimal = async (animalId) => {
    try {
      await animalService.eliminarAnimalDeLote(animalId);
      toast({ title: "Éxito", description: "Animal eliminado del lote correctamente" });
      fetchLotes();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchRanchos();
      fetchLotes();
    }
  }, [token]);

  const filteredLotes = lotes.filter(lote =>
    Object.values(lote).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalAnimales = lotes.reduce((sum, l) => sum + (l.totalAnimales || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <div className="bg-destructive/20 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Error al cargar lotes</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchLotes}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Gestión de Lotes
        </h1>
        <div className="flex flex-wrap gap-2">
          {/* Dialogo para crear/editar Lotes */}
          <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleCreateLote}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Lote
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Editar Lote" : "Crear Nuevo Lote"}</DialogTitle>
                <DialogDescription>
                  Complete los datos del lote.
                </DialogDescription>
              </DialogHeader>
              <LoteForm
                lote={editingLote}
                isEditing={isEditing}
                onSubmitSuccess={handleFormSuccess}
                onCancel={() => setIsFormDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Dialogo para asignar animales */}
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-500/90 hover:to-indigo-500/90 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Asignar Animales
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Asignar Animales a Lote</DialogTitle>
                <DialogDescription>
                  Seleccione un lote y los animales que desea asignar
                </DialogDescription>
              </DialogHeader>
              <AssignAnimalsForm
                lotes={lotes.filter(l => l.estado === 'Disponible')}
                onAssign={handleAssignAnimals}
                onCancel={() => setIsAssignDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-card/60 backdrop-blur-md p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por reemo, rancho, ubicación..."
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
              {['Disponible', 'Vendido', 'En proceso de venta'].map(estado => (
                <DropdownMenuCheckboxItem
                  key={estado}
                  onCheckedChange={() => { /* Lógica de filtrado */ }}
                >
                  {estado}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle className="text-xl text-foreground">
              Lista de Lotes ({lotes.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total de animales: {totalAnimales}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredLotes.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No se encontraron lotes
            </p>
          ) : (
            <div className="space-y-2">
              {filteredLotes.map(lote => (
                <LoteAccordion
                  key={lote.id_Lote}
                  lote={lote}
                  onEdit={handleEditLote}
                  onDelete={handleDeleteLote}
                  onForceDelete={handleForceDeleteLote}
                  onRemoveAnimal={handleRemoveAnimal}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LotesPage;