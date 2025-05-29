
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, Users, Maximize, Edit, Trash2, Eye } from 'lucide-react';
    import { Progress } from '@/components/ui/progress';
    import useLocalStorage from '@/hooks/useLocalStorage';
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
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Separator } from '@/components/ui/separator';

    const initialCorralesData = [
      { id: 'A1', nombre: 'Corral Alfa 1', capacidad: 50, tipoGanado: 'Novillos Engorde', estado: 'Optimo', notas: 'Riego automático funciona bien.' },
      { id: 'A2', nombre: 'Corral Alfa 2', capacidad: 50, tipoGanado: 'Vaquillas Reposición', estado: 'Lleno', notas: 'Revisar bebedero.' },
      { id: 'B1', nombre: 'Corral Beta 1', capacidad: 30, tipoGanado: 'Terneros Destete', estado: 'Medio Lleno', notas: '' },
      { id: 'B2', nombre: 'Corral Beta 2', capacidad: 30, tipoGanado: 'Vacío', estado: 'Vacío', notas: 'Listo para desinfección.' },
      { id: 'C1', nombre: 'Corral Gamma 1 (Cuarentena)', capacidad: 20, tipoGanado: 'Nuevos Ingresos', estado: 'En Uso', notas: 'Animales bajo observación.' },
    ];

    const CorralForm = ({ corral, onSubmit, onCancel }) => {
      const [formData, setFormData] = React.useState(
        corral || { nombre: '', capacidad: '', tipoGanado: '', estado: 'Vacío', notas: '' }
      );

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'capacidad' ? parseInt(value) || 0 : value }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Corral</Label>
            <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacidad">Capacidad Máxima</Label>
              <Input id="capacidad" name="capacidad" type="number" value={formData.capacidad} onChange={handleChange} required min="0" />
            </div>
            <div>
              <Label htmlFor="tipoGanado">Tipo de Ganado Principal</Label>
              <Input id="tipoGanado" name="tipoGanado" value={formData.tipoGanado} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="estado">Estado Actual</Label>
            <Input id="estado" name="estado" value={formData.estado} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="notas">Notas Adicionales</Label>
            <Input id="notas" name="notas" value={formData.notas} onChange={handleChange} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            </DialogClose>
            <Button type="submit">{corral ? 'Actualizar Corral' : 'Crear Corral'}</Button>
          </DialogFooter>
        </form>
      );
    };
    
    const CorralCard = ({ corral, ganadoAsignadoCount, onEdit, onDelete, onView }) => {
      const ocupacionPercent = corral.capacidad > 0 ? (ganadoAsignadoCount / corral.capacidad) * 100 : 0;
      let progressColor = "bg-primary";
      if (ocupacionPercent > 90) progressColor = "bg-red-500";
      else if (ocupacionPercent > 70) progressColor = "bg-yellow-500";

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
                  <CardTitle className="text-xl text-foreground">{corral.nombre} <span className="text-sm text-muted-foreground">({corral.id})</span></CardTitle>
                  <CardDescription className="text-xs">{corral.tipoGanado}</CardDescription>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${corral.estado === 'Optimo' ? 'bg-green-500/20 text-green-400' : corral.estado === 'Lleno' ? 'bg-red-500/20 text-red-400' : corral.estado === 'Vacío' ? 'bg-gray-500/20 text-gray-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {corral.estado}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ocupación:</span>
                <span className="font-semibold text-foreground">{ganadoAsignadoCount} / {corral.capacidad}</span>
              </div>
              <Progress value={ocupacionPercent} className="h-2.5" indicatorClassName={progressColor} />
              <div className="text-xs text-muted-foreground text-right">{ocupacionPercent.toFixed(1)}% Ocupado</div>
            </CardContent>
            <CardFooter className="gap-1">
              <Button variant="ghost" size="icon" onClick={() => onView(corral)} className="text-muted-foreground hover:text-primary">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onEdit(corral)} className="text-muted-foreground hover:text-yellow-500">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(corral.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1 hover:border-primary hover:text-primary ml-2">
                <Users className="mr-2 h-4 w-4" /> Ver Ganado ({ganadoAsignadoCount})
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };
    
    const RanchoPage = () => {
      const { toast } = useToast();
      const [corrales, setCorrales] = useLocalStorage('corralesData', initialCorralesData);
      const [ganado] = useLocalStorage('ganadoData', []); // Load ganado data to count animals per corral
      const [isFormOpen, setIsFormOpen] = React.useState(false);
      const [editingCorral, setEditingCorral] = React.useState(null);
      const [viewingCorral, setViewingCorral] = React.useState(null);
      const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);

      const getGanadoCountForCorral = (corralId) => {
        return ganado.filter(animal => animal.corral === corralId && animal.estado !== 'Vendido').length;
      };

      const handleAddCorral = (newCorral) => {
        const id = `C${String(corrales.length + 1).padStart(2, '0')}`;
        setCorrales(prev => [...prev, { ...newCorral, id }]);
        toast({ title: "Éxito", description: "Nuevo corral creado correctamente." });
        setIsFormOpen(false);
      };

      const handleEditCorral = (updatedCorral) => {
        setCorrales(prev => prev.map(c => c.id === updatedCorral.id ? updatedCorral : c));
        toast({ title: "Éxito", description: `Corral ${updatedCorral.id} actualizado.` });
        setIsFormOpen(false);
        setEditingCorral(null);
      };

      const handleDeleteCorral = (corralId) => {
        if (getGanadoCountForCorral(corralId) > 0) {
          toast({ title: "Error", description: "No se puede eliminar un corral con animales asignados.", variant: "destructive" });
          return;
        }
        if (window.confirm(`¿Está seguro de que desea eliminar el corral ${corralId}? Esta acción no se puede deshacer.`)) {
            setCorrales(prev => prev.filter(c => c.id !== corralId));
            toast({ title: "Eliminado", description: `Corral ${corralId} ha sido eliminado.`, variant: "destructive" });
        }
      };
      
      const openEditForm = (corral) => {
        setEditingCorral(corral);
        setIsFormOpen(true);
      };

      const openViewDialog = (corral) => {
        setViewingCorral(corral);
        setIsViewDialogOpen(true);
      };

      const totalCapacidad = corrales.reduce((sum, c) => sum + c.capacidad, 0);
      const totalOcupados = ganado.filter(g => g.estado !== 'Vendido' && corrales.find(c => c.id === g.corral)).length;
      const ocupacionPromedio = totalCapacidad > 0 ? (totalOcupados / totalCapacidad) * 100 : 0;

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Gestión de Corrales
            </h1>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all" onClick={() => setEditingCorral(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Corral
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingCorral ? 'Editar Corral' : 'Crear Nuevo Corral'}</DialogTitle>
                  <DialogDescription>
                    {editingCorral ? `Actualiza los detalles del corral ${editingCorral.nombre}.` : 'Define las características del nuevo corral.'}
                  </DialogDescription>
                </DialogHeader>
                <CorralForm 
                  corral={editingCorral} 
                  onSubmit={editingCorral ? handleEditCorral : handleAddCorral} 
                  onCancel={() => { setIsFormOpen(false); setEditingCorral(null); }} 
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-card/60 backdrop-blur-md p-4">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg text-foreground">Resumen de Corrales</CardTitle>
              <CardDescription>Visualiza la capacidad y ocupación actual de tus corrales.</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-primary">{corrales.length}</p>
                    <p className="text-sm text-muted-foreground">Corrales Totales</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-green-400">{totalOcupados}</p>
                    <p className="text-sm text-muted-foreground">Animales Alojados</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-blue-400">{totalCapacidad}</p>
                    <p className="text-sm text-muted-foreground">Capacidad Total</p>
                </div>
                 <div>
                    <p className="text-2xl font-bold text-orange-400">{ocupacionPromedio.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Ocupación Promedio</p>
                </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corrales.map((corral) => (
              <CorralCard 
                key={corral.id} 
                corral={corral} 
                ganadoAsignadoCount={getGanadoCountForCorral(corral.id)}
                onEdit={openEditForm}
                onDelete={handleDeleteCorral}
                onView={openViewDialog}
              />
            ))}
          </div>

          {viewingCorral && (
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Detalles del Corral: {viewingCorral.nombre} ({viewingCorral.id})</DialogTitle>
                </DialogHeader>
                <div className="grid gap-2 py-4 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <strong>Capacidad:</strong> <p>{viewingCorral.capacidad} animales</p>
                    <strong>Tipo Ganado:</strong> <p>{viewingCorral.tipoGanado}</p>
                    <strong>Estado:</strong> <p>{viewingCorral.estado}</p>
                    <strong>Animales Asignados:</strong> <p>{getGanadoCountForCorral(viewingCorral.id)}</p>
                  </div>
                  {viewingCorral.notas && (
                    <>
                      <Separator className="my-2" />
                      <strong>Notas:</strong> 
                      <p className="text-muted-foreground whitespace-pre-wrap">{viewingCorral.notas}</p>
                    </>
                  )}
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

    export default RanchoPage;
  