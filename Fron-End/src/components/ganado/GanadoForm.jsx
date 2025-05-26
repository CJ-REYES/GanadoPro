
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { DialogFooter, DialogClose } from "@/components/ui/dialog";

    const GanadoForm = ({ animal, onSubmit, onCancel }) => {
      const [formData, setFormData] = React.useState(
        animal || { identificador: '', raza: '', sexo: 'Macho', edad: '', peso: '', corral: '', estado: 'Saludable', fechaRegistro: new Date().toISOString().split('T')[0], notas: '' }
      );

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="identificador">Identificador Único</Label>
            <Input id="identificador" name="identificador" value={formData.identificador} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="raza">Raza</Label>
              <Input id="raza" name="raza" value={formData.raza} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Select name="sexo" value={formData.sexo} onValueChange={(value) => handleSelectChange('sexo', value)}>
                <SelectTrigger>
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
              <Label htmlFor="edad">Edad</Label>
              <Input id="edad" name="edad" value={formData.edad} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input id="peso" name="peso" type="number" value={formData.peso} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="corral">Corral Asignado</Label>
              <Input id="corral" name="corral" value={formData.corral} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select name="estado" value={formData.estado} onValueChange={(value) => handleSelectChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saludable">Saludable</SelectItem>
                  <SelectItem value="Enfermo">Enfermo</SelectItem>
                  <SelectItem value="Preñada">Preñada</SelectItem>
                  <SelectItem value="En engorde">En engorde</SelectItem>
                  <SelectItem value="Cuarentena">Cuarentena</SelectItem>
                  <SelectItem value="Vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="fechaRegistro">Fecha de Registro</Label>
            <Input id="fechaRegistro" name="fechaRegistro" type="date" value={formData.fechaRegistro} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="notas">Notas Adicionales</Label>
            <Input id="notas" name="notas" value={formData.notas} onChange={handleChange} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            </DialogClose>
            <Button type="submit">{animal ? 'Actualizar Animal' : 'Registrar Animal'}</Button>
          </DialogFooter>
        </form>
      );
    };

    export default GanadoForm;
  