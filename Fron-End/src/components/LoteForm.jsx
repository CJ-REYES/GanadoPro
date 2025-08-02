import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import * as loteService from '@/services/loteService';
import * as ranchoService from '@/services/ranchoService';
import { Loader2 } from 'lucide-react'; // Asegúrate de importar Loader2

const LoteForm = ({ 
  lote, 
  onSubmitSuccess, 
  onCancel,
  isEditing = false 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(
    lote || { id_rancho: '', remo: '', estado: 'Disponible' }
  );
  const [ranchos, setRanchos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRanchos, setIsLoadingRanchos] = useState(false);

  // Cargar ranchos al montar el componente
  useEffect(() => {
    const fetchRanchos = async () => {
      try {
        setIsLoadingRanchos(true);
        const data = await ranchoService.getRanchos();
        setRanchos(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los ranchos",
          variant: "destructive"
        });
      } finally {
        setIsLoadingRanchos(false);
      }
    };

    fetchRanchos();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        // Lógica para actualizar lote
        const updateData = {
          Id_Lote: formData.id_Lote,
          Remo: parseInt(formData.remo),
          Estado: formData.estado,
          Fecha_Entrada: formData.fechaEntrada ? formData.fechaEntrada.toISOString() : null,
          Fecha_Salida: formData.fechaSalida ? formData.fechaSalida.toISOString() : null,
          Observaciones: formData.observaciones || '',
          Id_Cliente: formData.id_Cliente || null
        };

        await loteService.updateLote(formData.id_Lote, updateData);
        toast({ title: "Éxito", description: "Lote actualizado correctamente" });
      } else {
        // Lógica para crear nuevo lote
        await loteService.createLote({
          id_rancho: parseInt(formData.id_rancho),
          remo: parseInt(formData.remo)
        });
        toast({ title: "Éxito", description: "Lote creado correctamente" });
      }

      // **CAMBIO CLAVE:** Llama a la función de éxito solo cuando la operación
      // (creación o actualización) se ha completado sin errores.
      onSubmitSuccess();

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditing && (
        <div className="space-y-2">
          <Label htmlFor="id_rancho" className="text-foreground">Rancho</Label>
          {isLoadingRanchos ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Cargando ranchos...</span>
            </div>
          ) : (
            <select
              id="id_rancho"
              name="id_rancho"
              value={formData.id_rancho}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={isLoadingRanchos}
            >
              <option value="">Seleccione un rancho</option>
              {ranchos.map(rancho => (
                <option key={rancho.id_Rancho} value={rancho.id_Rancho}>
                  {rancho.nombreRancho}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="remo" className="text-foreground">Reemo</Label>
        <Input 
          id="remo" 
          name="remo" 
          type="number" 
          value={formData.remo} 
          onChange={handleChange} 
          required 
          min="0"
          disabled={isLoading}
        />
      </div>
      
      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="estado" className="text-foreground">Estado</Label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
            disabled={isLoading}
          >
            <option value="Disponible">Disponible</option>
            <option value="Vendido">Vendido</option>
            <option value="En proceso de venta">En proceso de venta</option>
          </select>
        </div>
      )}
      
      <DialogFooter className="gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={isLoading || isLoadingRanchos}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : isEditing ? 'Actualizar Lote' : 'Crear Lote'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default LoteForm;