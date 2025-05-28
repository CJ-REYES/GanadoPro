import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const GanadoForm = ({ animal, onSuccess, onCancel }) => {
  const [formData, setFormData] = React.useState(
    animal || { 
      idRancho: '',
      arete: '', 
      raza: '', 
      sexo: 'Macho', 
      edad: '', 
      peso: '', 
      corral: '', 
      estado: 'Saludable', 
      fechaCompra: new Date().toISOString().split('T')[0], 
      notas: '' 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validación de todos los campos requeridos
      const camposRequeridos = [
        { nombre: 'idRancho', mensaje: 'El ID del rancho es requerido' },
        { nombre: 'arete', mensaje: 'El número de arete es requerido' },
        { nombre: 'raza', mensaje: 'La raza es requerida' },
        { nombre: 'sexo', mensaje: 'El sexo es requerido' },
        { nombre: 'fechaCompra', mensaje: 'La fecha de compra es requerida' }
      ];

      for (const campo of camposRequeridos) {
        if (!formData[campo.nombre]) {
          throw new Error(campo.mensaje);
        }
      }

      // Preparar el payload
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

      const response = await fetch('http://localhost:5201/api/Animales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || errorData.message || 'Error al registrar el animal');
      }

      const data = await response.json();
      
      toast({
        title: "Éxito",
        description: "Animal registrado correctamente",
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
        <Label htmlFor="idRancho">ID del Rancho*</Label>
        <Input 
          id="idRancho" 
          name="idRancho" 
          type="number"
          value={formData.idRancho} 
          onChange={handleChange} 
          required
        />
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
            value={formData.peso} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="corral">Corral/Lote</Label>
          <Input 
            id="corral" 
            name="corral" 
            type="number"
            value={formData.corral} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="estado">Estado</Label>
          <Select 
            value={formData.estado} 
            onValueChange={(value) => handleSelectChange('estado', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar estado" />
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
        <Label htmlFor="fechaCompra">Fecha de Compra/Registro*</Label>
        <Input 
          id="fechaCompra" 
          name="fechaCompra" 
          type="date" 
          value={formData.fechaCompra} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="notas">Notas/Origen</Label>
        <Input 
          id="notas" 
          name="notas" 
          value={formData.notas} 
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
          {isSubmitting ? 'Procesando...' : 'Registrar Animal'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default GanadoForm;