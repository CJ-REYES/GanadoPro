import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter, ChevronDown, Edit, Trash2 } from 'lucide-react';
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
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/components/ui/use-toast";
import { getToken, setToken, clearToken } from '@/hooks/useToken';

import useLocalStorage from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

const LoteForm = ({ lote, ranchos, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    lote || { id_rancho: '', remo: '', estado: 'Disponible' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      {!lote && (
        <div className="space-y-2">
          <Label htmlFor="id_rancho" className="text-foreground">Rancho</Label>
          <select
            id="id_rancho"
            name="id_rancho"
            value={formData.id_rancho}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Seleccione un rancho</option>
            {ranchos.map(rancho => (
              <option key={rancho.id_Rancho} value={rancho.id_Rancho}>
                {rancho.nombreRancho}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="remo" className="text-foreground">Remo</Label>
        <Input 
          id="remo" 
          name="remo" 
          type="number" 
          value={formData.remo} 
          onChange={handleChange} 
          required 
          min="0"
        />
      </div>
      
      {lote && (
        <div className="space-y-2">
          <Label htmlFor="estado" className="text-foreground">Estado</Label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="Disponible">Disponible</option>
            <option value="Vendido">Vendido</option>
            <option value="En Proceso">En Proceso</option>
          </select>
        </div>
      )}
      
      <DialogFooter className="gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {lote ? 'Actualizar Lote' : 'Crear Lote'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const LoteAccordion = ({ lote, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusClass = (estado) => {
    return cn(`px-2 py-1 text-xs rounded-full`,
      estado === 'Disponible' && 'bg-green-500/20 text-green-400',
      estado === 'Vendido' && 'bg-gray-500/20 text-gray-400',
      estado === 'En Proceso' && 'bg-yellow-500/20 text-yellow-400'
    );
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
              onDelete(lote.id_Lote);
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
                <p className="font-medium">{lote.nombreRancho}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ubicación</p>
                <p className="font-medium">{lote.comunidad}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha Entrada</p>
                <p className="font-medium">
                  {lote.fechaEntrada ? new Date(lote.fechaEntrada).toLocaleDateString() : 'N/A'}
                </p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {lote.animales.map(animal => (
                      <tr key={animal.id} className="border-b hover:bg-muted/30">
                        <td className="px-4 py-2">{animal.id}</td>
                        <td className="px-4 py-2">{animal.arete}</td>
                        <td className="px-4 py-2">
                          <span className={cn(`px-2 py-1 text-xs rounded-full`,
                            animal.sexo === 'Macho' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                          )}>
                            {animal.sexo}
                          </span>
                        </td>
                        <td className="px-4 py-2">{animal.edad} meses</td>
                        <td className="px-4 py-2">{animal.peso} kg</td>
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

const LotesPage = () => {
  const { toast } = useToast();
  const [lotes, setLotes] = useState([]);
  const [ranchos, setRanchos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLote, setEditingLote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [token] = useToken();
  const [user] = useLocalStorage('user', null);

  // Obtener ranchos
  const fetchRanchos = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5201/api/Ranchos', {
        headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json"}
      });
      if (!response.ok) throw new Error('Error al obtener ranchos');
      const data = await response.json();
      setRanchos(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Obtener lotes con animales
  const fetchLotes = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5201/api/Lotes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error al obtener lotes');
      const data = await response.json();
      
      // Normalizar los datos para asegurar compatibilidad
      const normalizedData = data.map(lote => ({
        ...lote,
        animales: lote.animales?.map(animal => ({
          ...animal,
          // Asegurar que tenemos la propiedad 'edad'
          edad: animal.edad || animal.edad_Meses || 0
        }))
      }));
      
      setLotes(normalizedData);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Crear nuevo lote
  const handleCreateLote = async (newLote) => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5201/api/Lotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Id_Rancho: parseInt(newLote.id_rancho),
          Remo: parseInt(newLote.remo)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear lote');
      }
      
      await fetchLotes(); // Refrescar datos
      
      toast({ title: "Éxito", description: "Lote creado correctamente" });
      setIsFormOpen(false);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Actualizar lote
  const handleUpdateLote = async (updatedLote) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5201/api/Lotes/${updatedLote.id_Lote}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Estado: updatedLote.estado
        })
      });
      
      if (!response.ok) throw new Error('Error al actualizar lote');
      
      await fetchLotes(); // Refrescar datos
      
      toast({ title: "Éxito", description: "Lote actualizado correctamente" });
      setIsFormOpen(false);
      setEditingLote(null);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Eliminar lote
  const handleDeleteLote = async (loteId) => {
    if (!token) return;
    if (!window.confirm('¿Está seguro de que desea eliminar este lote?')) return;
    
    try {
      const response = await fetch(`http://localhost:5201/api/Lotes/${loteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Error al eliminar lote');
      
      await fetchLotes(); // Refrescar datos
      
      toast({ title: "Éxito", description: "Lote eliminado correctamente" });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    if (token) {
      fetchRanchos();
      fetchLotes();
    }
  }, [token]);

  // CORRECCIÓN: Paréntesis faltantes en la función de filtrado
  const filteredLotes = lotes.filter(lote => 
    Object.values(lote).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalAnimales = lotes.reduce((sum, l) => sum + l.totalAnimales, 0);

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
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) setEditingLote(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all">
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Lote
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingLote ? 'Editar Lote' : 'Registrar Nuevo Lote'}</DialogTitle>
              <DialogDescription>
                {editingLote ? `Actualiza los detalles del lote #${editingLote.remo}.` : 'Completa la información para registrar un nuevo lote en el sistema.'}
              </DialogDescription>
            </DialogHeader>
            <LoteForm 
              lote={editingLote}
              ranchos={ranchos}
              onSubmit={editingLote ? handleUpdateLote : handleCreateLote} 
              onCancel={() => { 
                setIsFormOpen(false); 
                setEditingLote(null); 
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/60 backdrop-blur-md p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar por remo, rancho, ubicación..." 
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
              {['Disponible', 'Vendido', 'En Proceso'].map(estado => (
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
              <p>Cargando lotes...</p>
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
                  onEdit={(lote) => {
                    setEditingLote(lote);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDeleteLote}
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