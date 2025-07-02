import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

const GanadoForm = ({ animal, ranchos, onSuccess, onCancel }) => {
  const { token } = useAuth();
  const [formData, setFormData] = React.useState(
    animal || { 
      idRancho: '',
      arete: '', 
      raza: '', 
      sexo: 'Macho', 
      edad: '', 
      peso: '', 
      idLote: '', 
      clasificacion: 'Saludable', 
      estado: 'EnStock',
      fechaIngreso: new Date().toISOString().split('T')[0], 
      observaciones: '' 
    }
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validación de todos los campos requeridos
      if (!formData.idRancho) throw new Error('El rancho es requerido');
      if (!formData.arete) throw new Error('El número de arete es requerido');
      if (!formData.raza) throw new Error('La raza es requerida');
      if (!formData.sexo) throw new Error('El sexo es requerido');
      if (!formData.fechaIngreso) throw new Error('La fecha de ingreso es requerida');

      const method = animal ? 'PUT' : 'POST';
      const url = animal 
        ? `http://localhost:5201/api/Animales/${animal.id}`
        : 'http://localhost:5201/api/Animales';

      // Preparar el payload según el DTO del backend
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

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Error al registrar el animal';
        
        // Manejar error de arete duplicado
        if (errorData.Field === 'Arete') {
          errorMessage = errorData.Message;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      toast({
        title: "Éxito",
        description: animal 
          ? "Animal actualizado correctamente" 
          : "Animal registrado correctamente",
      });
      
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="idRancho">Rancho*</Label>
        <Select 
          value={formData.idRancho} 
          onValueChange={(value) => handleSelectChange('idRancho', value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar rancho" />
          </SelectTrigger>
          <SelectContent>
            {ranchos.map(rancho => (
              <SelectItem key={rancho.id_Rancho} value={rancho.id_Rancho.toString()}>
                {rancho.nombreRancho}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="arete">Arete*</Label>
        <Input 
          id="arete" 
          name="arete" 
          value={formData.arete} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="raza">Raza*</Label>
          <Input 
            id="raza" 
            name="raza" 
            value={formData.raza} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="sexo">Sexo*</Label>
          <Select 
            value={formData.sexo} 
            onValueChange={(value) => handleSelectChange('sexo', value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edad">Edad (meses)</Label>
          <Input 
            id="edad" 
            name="edad" 
            type="number"
            min="0"
            value={formData.edad} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input 
            id="peso" 
            name="peso" 
            type="number"
            step="0.1"
            min="0"
            value={formData.peso} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="idLote">ID de Lote</Label>
          <Input 
            id="idLote" 
            name="idLote" 
            type="number"
            min="0"
            value={formData.idLote} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="clasificacion">Clasificación</Label>
          <Select 
            value={formData.clasificacion} 
            onValueChange={(value) => handleSelectChange('clasificacion', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar clasificación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Saludable">Saludable</SelectItem>
              <SelectItem value="Enfermo">Enfermo</SelectItem>
              <SelectItem value="Preñada">Preñada</SelectItem>
              <SelectItem value="En engorde">En engorde</SelectItem>
              <SelectItem value="Cuarentena">Cuarentena</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="fechaIngreso">Fecha de Ingreso*</Label>
        <Input 
          id="fechaIngreso" 
          name="fechaIngreso" 
          type="date" 
          value={formData.fechaIngreso} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="observaciones">Observaciones</Label>
        <Input 
          id="observaciones" 
          name="observaciones" 
          value={formData.observaciones} 
          onChange={handleChange} 
        />
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Procesando...' : (animal ? 'Actualizar Animal' : 'Registrar Animal')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default GanadoForm;