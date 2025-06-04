import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import RanchoForm from '@/components/Ranchos/RanchoForm';
import { getToken, setToken, clearToken } from '@/hooks/useToken';


// Hook useLocalStorage modificado para manejar objetos y cadenas
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

const RanchoCard = ({ rancho, onEdit, onDelete, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" }}
    >
      <Card className="bg-card/80 backdrop-blur-sm hover:shadow-primary/10 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-foreground">{rancho.nombreRancho}</CardTitle>
              <CardDescription className="text-xs">{rancho.ubicacion}</CardDescription>
            </div>
            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
              Activo
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Propietario:</span>
            <span className="font-semibold text-foreground">{rancho.propietario}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Lotes:</span>
            <span className="font-semibold text-foreground">{rancho.totalLotes}</span>
          </div>
        </CardContent>
        <CardFooter className="gap-1">
          <Button variant="ghost" size="icon" onClick={() => onView(rancho)} className="text-muted-foreground hover:text-primary">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(rancho)} className="text-muted-foreground hover:text-yellow-500">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(rancho.id_Rancho)} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const RanchosPage = () => {
  const { toast } = useToast();
  const [ranchos, setRanchos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRancho, setEditingRancho] = useState(null);
  const [viewingRancho, setViewingRancho] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Usa el hook useToken para el token
  const [token] = useToken();
  
  // Usa el hook useLocalStorage para el usuario
  const [user] = useLocalStorage('user', null);

  // Obtener ranchos desde la API
  const fetchRanchos = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:5201/api/Ranchos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al obtener ranchos');
      
      const data = await response.json();
      setRanchos(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Crear nuevo rancho
  const handleCreateRancho = async (newRancho) => {
    if (!token || !user) {
      toast({ title: "Error", description: "Falta token o información de usuario", variant: "destructive" });
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5201/api/Ranchos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newRancho,
          Id_User: user.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear rancho');
      }
      
      const createdRancho = await response.json();
      
      // Actualizar lista de ranchos
      setRanchos([...ranchos, createdRancho]);
      
      // Guardar ID del rancho en localStorage
      localStorage.setItem('currentRanchoId', createdRancho.id_Rancho);
      
      toast({ title: "Éxito", description: "Rancho creado correctamente" });
      setIsFormOpen(false);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Actualizar rancho existente
  const handleUpdateRancho = async (updatedRancho) => {
    if (!token) return;
    
    try {
      const response = await fetch(`http://localhost:5201/api/Ranchos/${updatedRancho.id_Rancho}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          NombreRancho: updatedRancho.nombreRancho,
          Ubicacion: updatedRancho.ubicacion
        })
      });
      
      if (!response.ok) throw new Error('Error al actualizar rancho');
      
      // Actualizar el estado local
      setRanchos(ranchos.map(r => 
        r.id_Rancho === updatedRancho.id_Rancho ? {...r, ...updatedRancho} : r
      ));
      
      toast({ title: "Éxito", description: "Rancho actualizado correctamente" });
      setIsFormOpen(false);
      setEditingRancho(null);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Eliminar rancho
  const handleDeleteRancho = async (ranchoId) => {
    if (!token) return;
    
    try {
      const response = await fetch(`http://localhost:5201/api/Ranchos/${ranchoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar rancho');
      
      setRanchos(ranchos.filter(r => r.id_Rancho !== ranchoId));
      toast({ title: "Éxito", description: "Rancho eliminado correctamente" });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchRanchos();
  }, [token]);

  const totalRanchos = ranchos.length;
  const totalLotes = ranchos.reduce((sum, r) => sum + r.totalLotes, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Gestión de Ranchos
        </h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all"
              onClick={() => setEditingRancho(null)}
              disabled={!token}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Rancho
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingRancho ? 'Editar Rancho' : 'Crear Nuevo Rancho'}</DialogTitle>
              <DialogDescription>
                {editingRancho 
                  ? `Actualiza los detalles del rancho ${editingRancho.nombreRancho}` 
                  : 'Define las características del nuevo rancho'}
              </DialogDescription>
            </DialogHeader>
            <RanchoForm 
              rancho={editingRancho} 
              onSubmit={editingRancho ? handleUpdateRancho : handleCreateRancho} 
              onCancel={() => { 
                setIsFormOpen(false); 
                setEditingRancho(null); 
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/60 backdrop-blur-md p-4">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg text-foreground">Resumen de Ranchos</CardTitle>
          <CardDescription>Visualiza la información general de tus ranchos</CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center p-4">
            <p className="text-2xl font-bold text-primary">{totalRanchos}</p>
            <p className="text-sm text-muted-foreground">Ranchos Totales</p>
          </Card>
          <Card className="text-center p-4">
            <p className="text-2xl font-bold text-green-400">{totalLotes}</p>
            <p className="text-sm text-muted-foreground">Lotes Totales</p>
          </Card>
          <Card className="text-center p-4">
            <p className="text-2xl font-bold text-blue-400">{user?.name || 'Usuario'}</p>
            <p className="text-sm text-muted-foreground">Propietario</p>
          </Card>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ranchos.map((rancho) => (
          <RanchoCard 
            key={rancho.id_Rancho} 
            rancho={rancho} 
            onEdit={(r) => {
              setEditingRancho(r);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteRancho}
            onView={(r) => {
              setViewingRancho(r);
              setIsViewDialogOpen(true);
            }}
          />
        ))}
      </div>

      {viewingRancho && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles del Rancho: {viewingRancho.nombreRancho}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <strong>ID:</strong> 
                <p>{viewingRancho.id_Rancho}</p>
                
                <strong>Ubicación:</strong> 
                <p>{viewingRancho.ubicacion || 'No especificada'}</p>
                
                <strong>Propietario:</strong> 
                <p>{viewingRancho.propietario}</p>
                
                <strong>Email:</strong> 
                <p>{viewingRancho.email}</p>
                
                <strong>Teléfono:</strong> 
                <p>{viewingRancho.telefono}</p>
                
                <strong>Total de Lotes:</strong> 
                <p>{viewingRancho.totalLotes}</p>
              </div>
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

export default RanchosPage;