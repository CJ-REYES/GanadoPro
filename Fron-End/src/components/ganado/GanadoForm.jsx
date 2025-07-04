import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  createAnimal,
  updateAnimal,
  getAnimalById
} from '@/services/ganadoService';

const GanadoForm = ({ animalId, onSuccess, onCancel }) => {
  const [formData, setFormData] = React.useState({
    Id_Rancho: '',
    Arete: '', 
    Raza: '', 
    Sexo: 'Macho', 
    Edad_Meses: '', 
    Peso: '', 
    Id_Lote: '', 
    Estado: 'EnStock',
    FechaIngreso: new Date().toISOString().split('T')[0],
    Observaciones: '',
    Clasificacion: '',
    UppOrigen: '',
    UppDestino: '',
    FechaSalida: '',
    MotivoSalida: '',
    FoliGuiaRemoEntrada: '',
    FoliGuiaRemoSalida: '',
    CertificadoZootanitario: '',
    ContanciaGarrapaticida: '',
    FolioTB: '',
    ValidacionConside_ID: '',
    FierroCliente: '',
    RazonSocial: ''
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const { toast } = useToast();

  // Cargar datos del animal si estamos editando
  React.useEffect(() => {
    if (animalId) {
      const loadAnimalData = async () => {
        setIsLoading(true);
        try {
          const animal = await getAnimalById(animalId);
          setFormData({
            Id_Rancho: animal.id_Rancho,
            Arete: animal.arete,
            Raza: animal.raza,
            Sexo: animal.sexo,
            Edad_Meses: animal.edad_Meses,
            Peso: animal.peso,
            Id_Lote: animal.id_Lote,
            Estado: animal.estado,
            FechaIngreso: animal.fechaIngreso,
            Observaciones: animal.observaciones,
            Clasificacion: animal.clasificacion,
            UppOrigen: animal.uppOrigen,
            UppDestino: animal.uppDestino,
            FechaSalida: animal.fechaSalida,
            MotivoSalida: animal.motivoSalida,
            FoliGuiaRemoEntrada: animal.foliGuiaRemoEntrada,
            FoliGuiaRemoSalida: animal.foliGuiaRemoSalida,
            CertificadoZootanitario: animal.certificadoZootanitario,
            ContanciaGarrapaticida: animal.contanciaGarrapaticida,
            FolioTB: animal.folioTB,
            ValidacionConside_ID: animal.validacionConside_ID,
            FierroCliente: animal.fierroCliente,
            RazonSocial: animal.razonSocial
          });
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
      
      loadAnimalData();
    }
  }, [animalId, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convertir UPP a mayúsculas automáticamente
    if (name === 'UppOrigen' || name === 'UppDestino') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Limpiar errores al cambiar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores al cambiar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, FierroCliente: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validar campos requeridos
  const validateRequiredFields = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.Id_Rancho) {
      newErrors.Id_Rancho = 'El ID del rancho es requerido';
      isValid = false;
    }
    
    if (!formData.Arete) {
      newErrors.Arete = 'El número de arete es requerido';
      isValid = false;
    }
    
    if (!formData.Raza) {
      newErrors.Raza = 'La raza es requerida';
      isValid = false;
    }
    
    if (!formData.Sexo) {
      newErrors.Sexo = 'El sexo es requerido';
      isValid = false;
    }
    
    if (!formData.FechaIngreso) {
      newErrors.FechaIngreso = 'La fecha de ingreso es requerida';
      isValid = false;
    }

    // Validar formato UPP
    if (formData.UppOrigen && !/^[A-Z0-9]{10}$/.test(formData.UppOrigen)) {
      newErrors.UppOrigen = 'UPP debe tener 10 caracteres alfanuméricos';
      isValid = false;
    }
    
    if (formData.UppDestino && !/^[A-Z0-9]{10}$/.test(formData.UppDestino)) {
      newErrors.UppDestino = 'UPP debe tener 10 caracteres alfanuméricos';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Verificar si todos los campos requeridos están llenos
  const isFormValid = () => {
    return (
      formData.Id_Rancho &&
      formData.Arete &&
      formData.Raza &&
      formData.Sexo &&
      formData.FechaIngreso
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos antes de enviar
    if (!validateRequiredFields()) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos correctamente",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar payload según la API
      const payload = {
        Id_Rancho: Number(formData.Id_Rancho),
        Arete: formData.Arete,
        Peso: formData.Peso ? Number(formData.Peso) : null,
        Sexo: formData.Sexo,
        Clasificacion: formData.Clasificacion || null,
        Raza: formData.Raza,
        Edad_Meses: formData.Edad_Meses ? Number(formData.Edad_Meses) : 0,
        FoliGuiaRemoEntrada: formData.FoliGuiaRemoEntrada || null,
        FoliGuiaRemoSalida: formData.FoliGuiaRemoSalida || null,
        UppOrigen: formData.UppOrigen || null,
        UppDestino: formData.UppDestino || null,
        FechaIngreso: formData.FechaIngreso,
        FechaSalida: formData.FechaSalida || null,
        MotivoSalida: formData.MotivoSalida || null,
        Observaciones: formData.Observaciones || null,
        CertificadoZootanitario: formData.CertificadoZootanitario || null,
        ContanciaGarrapaticida: formData.ContanciaGarrapaticida || null,
        FolioTB: formData.FolioTB || null,
        ValidacionConside_ID: formData.ValidacionConside_ID || null,
        FierroCliente: formData.FierroCliente || null,
        RazonSocial: formData.RazonSocial || null,
        Estado: formData.Estado,
        Id_Lote: formData.Id_Lote ? Number(formData.Id_Lote) : null
      };

      let result;
      if (animalId) {
        // Actualizar animal existente
        await updateAnimal(animalId, payload);
        result = { id_Animal: animalId, ...payload };
        toast({
          title: "Éxito",
          description: "Animal actualizado correctamente",
        });
      } else {
        // Crear nuevo animal
        result = await createAnimal(payload);
        toast({
          title: "Éxito",
          description: "Animal registrado correctamente",
        });
      }
      
      if (onSuccess) {
        onSuccess(result);
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

  if (isLoading) {
    return <div className="text-center py-4">Cargando datos del animal...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Id_Rancho">
            ID del Rancho*
            {!formData.Id_Rancho && (
              <span className="text-red-500 ml-1">(Requerido)</span>
            )}
          </Label>
          <Input 
            id="Id_Rancho" 
            name="Id_Rancho" 
            type="number"
            value={formData.Id_Rancho} 
            onChange={handleChange} 
          />
          {errors.Id_Rancho && (
            <p className="text-red-500 text-xs mt-1">{errors.Id_Rancho}</p>
          )}
        </div>

        <div>
          <Label htmlFor="Arete">
            Arete*
            {!formData.Arete && (
              <span className="text-red-500 ml-1">(Requerido)</span>
            )}
          </Label>
          <Input 
            id="Arete" 
            name="Arete" 
            value={formData.Arete} 
            onChange={handleChange} 
          />
          {errors.Arete && (
            <p className="text-red-500 text-xs mt-1">{errors.Arete}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Raza">
            Raza*
            {!formData.Raza && (
              <span className="text-red-500 ml-1">(Requerido)</span>
            )}
          </Label>
          <Input 
            id="Raza" 
            name="Raza" 
            value={formData.Raza} 
            onChange={handleChange} 
          />
          {errors.Raza && (
            <p className="text-red-500 text-xs mt-1">{errors.Raza}</p>
          )}
        </div>
        <div>
          <Label htmlFor="Sexo">
            Sexo*
            {!formData.Sexo && (
              <span className="text-red-500 ml-1">(Requerido)</span>
            )}
          </Label>
          <Select 
            value={formData.Sexo} 
            onValueChange={(value) => handleSelectChange('Sexo', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>
          {errors.Sexo && (
            <p className="text-red-500 text-xs mt-1">{errors.Sexo}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Edad_Meses">Edad (meses)</Label>
          <Input 
            id="Edad_Meses" 
            name="Edad_Meses" 
            type="number"
            value={formData.Edad_Meses} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="Peso">Peso (kg)</Label>
          <Input 
            id="Peso" 
            name="Peso" 
            type="number"
            step="0.1"
            value={formData.Peso} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Id_Lote">Lote</Label>
          <Input 
            id="Id_Lote" 
            name="Id_Lote" 
            type="number"
            value={formData.Id_Lote} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="Estado">Estado</Label>
          <Select 
            value={formData.Estado} 
            onValueChange={(value) => handleSelectChange('Estado', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EnStock">En Stock</SelectItem>
              <SelectItem value="Vendido">Vendido</SelectItem>
              <SelectItem value="Baja">Baja</SelectItem>
              <SelectItem value="Trasladado">Trasladado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Clasificacion">Clasificación</Label>
          <Input 
            id="Clasificacion" 
            name="Clasificacion" 
            value={formData.Clasificacion} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="RazonSocial">Razón Social</Label>
          <Input 
            id="RazonSocial" 
            name="RazonSocial" 
            value={formData.RazonSocial} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="UppOrigen">UPP Origen (10 caracteres)</Label>
          <Input 
            id="UppOrigen" 
            name="UppOrigen" 
            value={formData.UppOrigen} 
            onChange={handleChange} 
            maxLength={10}
            placeholder="Ej: ABC1234567"
          />
          {errors.UppOrigen && (
            <p className="text-red-500 text-xs mt-1">{errors.UppOrigen}</p>
          )}
        </div>
        <div>
          <Label htmlFor="UppDestino">UPP Destino (10 caracteres)</Label>
          <Input 
            id="UppDestino" 
            name="UppDestino" 
            value={formData.UppDestino} 
            onChange={handleChange} 
            maxLength={10}
            placeholder="Ej: XYZ9876543"
          />
          {errors.UppDestino && (
            <p className="text-red-500 text-xs mt-1">{errors.UppDestino}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="FoliGuiaRemoEntrada">Folio Guía Remoción Entrada</Label>
          <Input 
            id="FoliGuiaRemoEntrada" 
            name="FoliGuiaRemoEntrada" 
            value={formData.FoliGuiaRemoEntrada} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="FoliGuiaRemoSalida">Folio Guía Remoción Salida</Label>
          <Input 
            id="FoliGuiaRemoSalida" 
            name="FoliGuiaRemoSalida" 
            value={formData.FoliGuiaRemoSalida} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="FechaIngreso">
            Fecha de Ingreso*
            {!formData.FechaIngreso && (
              <span className="text-red-500 ml-1">(Requerido)</span>
            )}
          </Label>
          <Input 
            id="FechaIngreso" 
            name="FechaIngreso" 
            type="date" 
            value={formData.FechaIngreso} 
            onChange={handleChange} 
          />
          {errors.FechaIngreso && (
            <p className="text-red-500 text-xs mt-1">{errors.FechaIngreso}</p>
          )}
        </div>
        <div>
          <Label htmlFor="FechaSalida">Fecha de Salida</Label>
          <Input 
            id="FechaSalida" 
            name="FechaSalida" 
            type="date" 
            value={formData.FechaSalida} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="MotivoSalida">Motivo de Salida</Label>
        <Input 
          id="MotivoSalida" 
          name="MotivoSalida" 
          value={formData.MotivoSalida} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="CertificadoZootanitario">Certificado Zootanitario</Label>
          <Input 
            id="CertificadoZootanitario" 
            name="CertificadoZootanitario" 
            value={formData.CertificadoZootanitario} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="ContanciaGarrapaticida">Constancia Garrapaticida</Label>
          <Input 
            id="ContanciaGarrapaticida" 
            name="ContanciaGarrapaticida" 
            value={formData.ContanciaGarrapaticida} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="FolioTB">Folio TB</Label>
          <Input 
            id="FolioTB" 
            name="FolioTB" 
            value={formData.FolioTB} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="ValidacionConside_ID">Validación Conside ID</Label>
          <Input 
            id="ValidacionConside_ID" 
            name="ValidacionConside_ID" 
            value={formData.ValidacionConside_ID} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="FierroCliente">Fierro del Cliente (Imagen)</Label>
        <Input 
          id="FierroCliente" 
          name="FierroCliente" 
          type="file" 
          accept="image/*"
          onChange={handleFileChange} 
        />
      </div>
      
      <div>
        <Label htmlFor="Observaciones">Observaciones</Label>
        <Input 
          id="Observaciones" 
          name="Observaciones" 
          value={formData.Observaciones} 
          onChange={handleChange} 
        />
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        </DialogClose>
        <Button 
          type="submit" 
          disabled={isSubmitting || !isFormValid()}
          className={!isFormValid() ? "bg-gray-400 cursor-not-allowed" : ""}
        >
          {isSubmitting ? 'Procesando...' : (animalId ? 'Actualizar Animal' : 'Registrar Animal')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default GanadoForm;