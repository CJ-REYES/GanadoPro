
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, Search, Filter } from 'lucide-react';
    import { Input } from '@/components/ui/input';
    import {
      DropdownMenu,
      DropdownMenuCheckboxItem,
      DropdownMenuContent,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
      DialogTrigger,
    } from "@/components/ui/dialog";
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { useToast } from "@/components/ui/use-toast";
    import { Separator } from '@/components/ui/separator';
    import GanadoForm from '@/components/ganado/GanadoForm';
    import GanadoTable from '@/components/ganado/GanadoTable';

    const initialGanadoData = [
      { id: 'G001', identificador: 'ID-ANGUS-001', raza: 'Angus', sexo: 'Macho', edad: '2 años', peso: '450 kg', corral: 'A1', estado: 'Saludable', fechaRegistro: '2024-03-15', notas: 'Buen temperamento' },
      { id: 'G002', identificador: 'ID-HEREFORD-002', raza: 'Hereford', sexo: 'Hembra', edad: '3 años', peso: '500 kg', corral: 'B2', estado: 'Preñada', fechaRegistro: '2024-01-20', notas: 'Confirmada preñez hace 1 mes' },
      { id: 'G003', identificador: 'ID-BRANGUS-003', raza: 'Brangus', sexo: 'Macho', edad: '1.5 años', peso: '380 kg', corral: 'A1', estado: 'En engorde', fechaRegistro: '2024-05-01', notas: '' },
      { id: 'G004', identificador: 'ID-ANGUS-004', raza: 'Angus', sexo: 'Hembra', edad: '2.5 años', peso: '480 kg', corral: 'C3', estado: 'Saludable', fechaRegistro: '2023-12-10', notas: 'Excelente madre' },
      { id: 'G005', identificador: 'ID-LIMOUSIN-005', raza: 'Limousin', sexo: 'Macho', edad: 'N/A', peso: '550 kg', corral: 'Vendido', estado: 'Vendido', fechaRegistro: '2023-11-05', notas: 'Vendido a Comprador X' },
      { id: 'G006', identificador: 'ID-CHAROLAIS-006', raza: 'Charolais', sexo: 'Hembra', edad: 'N/A', peso: '520 kg', corral: 'Vendido', estado: 'Vendido', fechaRegistro: '2024-02-28', notas: 'Vendido a Comprador Y' },
    ];
    
    const GanadoPage = () => {
      const { toast } = useToast();
      const [searchTerm, setSearchTerm] = React.useState("");
      const [ganado, setGanado] = useLocalStorage('ganadoData', initialGanadoData);
      const [isFormOpen, setIsFormOpen] = React.useState(false);
      const [editingAnimal, setEditingAnimal] = React.useState(null);
      const [viewingAnimal, setViewingAnimal] = React.useState(null);
      const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);

      const handleAddAnimal = (newAnimal) => {
        const nextIdNumber = ganado.reduce((max, item) => {
            const currentIdNum = parseInt(item.id.substring(1), 10);
            return currentIdNum > max ? currentIdNum : max;
        }, 0) + 1;
        const id = `G${String(nextIdNumber).padStart(3, '0')}`;
        setGanado(prev => [...prev, { ...newAnimal, id }]);
        toast({ title: "Éxito", description: "Nuevo animal registrado correctamente." });
        setIsFormOpen(false);
      };

      const handleEditAnimal = (updatedAnimal) => {
        setGanado(prev => prev.map(a => a.id === updatedAnimal.id ? updatedAnimal : a));
        toast({ title: "Éxito", description: `Animal ${updatedAnimal.id} actualizado.` });
        setIsFormOpen(false);
        setEditingAnimal(null);
      };
      
      const handleDeleteAnimal = (animalId) => {
         if (window.confirm(`¿Está seguro de que desea eliminar el animal ${animalId}? Esta acción no se puede deshacer.`)) {
            setGanado(prev => prev.filter(a => a.id !== animalId));
            toast({ title: "Eliminado", description: `Animal ${animalId} ha sido eliminado.`, variant: "destructive" });
        }
      };

      const openEditForm = (animal) => {
        setEditingAnimal(animal);
        setIsFormOpen(true);
      };
      
      const openViewDialog = (animal) => {
        setViewingAnimal(animal);
        setIsViewDialogOpen(true);
      };

      const filterGanado = (list) => list.filter(animal => 
        Object.values(animal).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      const machos = filterGanado(ganado.filter(g => g.sexo === 'Macho' && g.estado !== 'Vendido'));
      const hembras = filterGanado(ganado.filter(g => g.sexo === 'Hembra' && g.estado !== 'Vendido'));
      const vendidos = filterGanado(ganado.filter(g => g.estado === 'Vendido'));

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Gestión de Ganado
            </h1>
            <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
              setIsFormOpen(isOpen);
              if (!isOpen) setEditingAnimal(null);
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all" onClick={() => setEditingAnimal(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Registrar Animal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingAnimal ? 'Editar Animal' : 'Registrar Nuevo Animal'}</DialogTitle>
                  <DialogDescription>
                    {editingAnimal ? `Actualiza los detalles del animal ${editingAnimal.id}.` : 'Completa la información para registrar un nuevo animal en el sistema.'}
                  </DialogDescription>
                </DialogHeader>
                <GanadoForm 
                  animal={editingAnimal} 
                  onSubmit={editingAnimal ? handleEditAnimal : handleAddAnimal} 
                  onCancel={() => { setIsFormOpen(false); setEditingAnimal(null); }} 
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-card/60 backdrop-blur-md p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por ID, raza, corral, estado..." 
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
                  {['Saludable', 'Enfermo', 'Preñada', 'En engorde', 'Cuarentena'].map(estado => (
                    <DropdownMenuCheckboxItem key={estado} onCheckedChange={() => { /* Implement filter logic */ }}>
                      {estado}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>

          <Tabs defaultValue="machos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="machos">Machos ({machos.length})</TabsTrigger>
              <TabsTrigger value="hembras">Hembras ({hembras.length})</TabsTrigger>
              <TabsTrigger value="vendidos">Vendidos ({vendidos.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="machos">
              <GanadoTable data={machos} title="Lista de Ganado - Machos" onView={openViewDialog} onEdit={openEditForm} onDelete={handleDeleteAnimal} />
            </TabsContent>
            <TabsContent value="hembras">
              <GanadoTable data={hembras} title="Lista de Ganado - Hembras" onView={openViewDialog} onEdit={openEditForm} onDelete={handleDeleteAnimal} />
            </TabsContent>
            <TabsContent value="vendidos">
              <GanadoTable data={vendidos} title="Lista de Ganado - Vendidos" onView={openViewDialog} onEdit={openEditForm} onDelete={handleDeleteAnimal} />
            </TabsContent>
          </Tabs>

          {viewingAnimal && (
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Detalles del Animal: {viewingAnimal.id} ({viewingAnimal.identificador})</DialogTitle>
                </DialogHeader>
                <div className="grid gap-2 py-4 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <strong>Raza:</strong> <p>{viewingAnimal.raza}</p>
                    <strong>Sexo:</strong> <p>{viewingAnimal.sexo}</p>
                    <strong>Edad:</strong> <p>{viewingAnimal.edad}</p>
                    <strong>Peso:</strong> <p>{viewingAnimal.peso}</p>
                    <strong>Corral:</strong> <p>{viewingAnimal.corral}</p>
                    <strong>Estado:</strong> <p>{viewingAnimal.estado}</p>
                    <strong>Fecha Registro:</strong> <p>{viewingAnimal.fechaRegistro}</p>
                  </div>
                  {viewingAnimal.notas && (
                    <>
                      <Separator className="my-2" />
                      <strong>Notas:</strong> 
                      <p className="text-muted-foreground whitespace-pre-wrap">{viewingAnimal.notas}</p>
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

    export default GanadoPage;
  