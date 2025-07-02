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
      Id_Rancho: '',
      Arete: '', 
      Raza: '', 
      Sexo: 'Macho', 
      Edad_Meses: '', 
      Peso: '', 
      Id_Lote: '', 
      Estado: 'EnStock',  // Estado corregido según API
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Mantener el base64 completo para la API
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, FierroCliente: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validación de campos requeridos
      if (!formData.Id_Rancho) throw new Error('El ID del rancho es requerido');
      if (!formData.Arete) throw new Error('El número de arete es requerido');
      if (!formData.Raza) throw new Error('La raza es requerida');
      if (!formData.Sexo) throw new Error('El sexo es requerido');
      if (!formData.FechaIngreso) throw new Error('La fecha de ingreso es requerida');

      // Validar UPP si se proporciona
      if (formData.UppOrigen && !/^[A-Z0-9]{10}$/.test(formData.UppOrigen)) {
        throw new Error('UPP Origen debe tener 10 caracteres alfanuméricos en mayúsculas');
      }
      
      if (formData.UppDestino && !/^[A-Z0-9]{10}$/.test(formData.UppDestino)) {
        throw new Error('UPP Destino debe tener 10 caracteres alfanuméricos en mayúsculas');
      }

      // Preparar payload según el CreateAnimalDto de la API
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
        MotivoSalida: formData.MotivoSalida || null,
        Observaciones: formData.Observaciones || null,
        CertificadoZootanitario: formData.CertificadoZootanitario || null,
        ContanciaGarrapaticida: formData.ContanciaGarrapaticida || null,
        FolioTB: formData.FolioTB || null,
        ValidacionConside_ID: formData.ValidacionConside_ID || null,
        FierroCliente: formData.FierroCliente ? formData.FierroCliente.split(',')[1] : null,
        RazonSocial: formData.RazonSocial || null,
        Estado: formData.Estado,
        Id_Lote: formData.Id_Lote ? Number(formData.Id_Lote) : null
      };

      // Verificar token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación. Por favor, inicie sesión nuevamente.');
      }

      // Enviar datos a la API
      const response = await fetch('http://localhost:5201/api/Animales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      // Manejar respuesta de la API
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Manejar errores específicos de la API
        const errorMessage = errorData.Field 
          ? `Error en ${errorData.Field}: ${errorData.Message || errorData.message}`
          : errorData.Message || errorData.message || 'Error al registrar el animal';
          
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Mostrar mensaje de éxito
      toast({
        title: "Éxito",
        description: "Animal registrado correctamente",
      });
      
      // Llamar a la función de éxito si está definida
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      // Mostrar mensaje de error
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Id_Rancho">ID del Rancho*</Label>
          <Input 
            id="Id_Rancho" 
            name="Id_Rancho" 
            type="number"
            value={formData.Id_Rancho} 
            onChange={handleChange} 
            required
          />
        </div>

        <div>
          <Label htmlFor="Arete">Arete*</Label>
          <Input 
            id="Arete" 
            name="Arete" 
            value={formData.Arete} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Raza">Raza*</Label>
          <Input 
            id="Raza" 
            name="Raza" 
            value={formData.Raza} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="Sexo">Sexo*</Label>
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
          <Label htmlFor="FechaIngreso">Fecha de Ingreso*</Label>
          <Input 
            id="FechaIngreso" 
            name="FechaIngreso" 
            type="date" 
            value={formData.FechaIngreso} 
            onChange={handleChange} 
            required 
          />
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Procesando...' : 'Registrar Animal'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default GanadoForm;