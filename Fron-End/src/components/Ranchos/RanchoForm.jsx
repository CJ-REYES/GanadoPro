import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const RanchoForm = ({ rancho, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState(
    rancho || { nombreRancho: '', ubicacion: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombreRancho">Nombre del Rancho *</Label>
        <Input 
          id="nombreRancho" 
          name="nombreRancho" 
          value={formData.nombreRancho} 
          onChange={handleChange} 
          required 
          placeholder="Ej: Rancho Santa Fe"
        />
      </div>
      <div>
        <Label htmlFor="ubicacion">Ubicación</Label>
        <Input 
          id="ubicacion" 
          name="ubicacion" 
          value={formData.ubicacion} 
          onChange={handleChange} 
          placeholder="Ej: Chihuahua, México"
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {rancho ? 'Actualizar Rancho' : 'Crear Rancho'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default RanchoForm;