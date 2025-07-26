// CompradoresPage.jsx
import { getUser } from '@/hooks/useToken'; 
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, UserCheck } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as clienteService from '@/services/ClientesService';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose
} from '@/components/ui/dialog';

const initialClienteData = {
  Id_User: 1,
  Rol: '',
  Name: '',
  Propietario: '',
  Domicilio: '',
  Localidad: '',
  Municipio: '',
  Entidad: '',
  Upp: ''
};

const CompradoresPage = () => {
  const [formData, setFormData] = useState(initialClienteData);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const loadClientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clienteService.getClientes();
      const compradores = data.filter(c => c.Rol === "Comprador" || c.Rol === "Cliente");
      setClientes(compradores);
      setError(null);
    } catch (err) {
      console.error("Error cargando compradores:", err);
      setError("Error al cargar los compradores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getUser();

    const payload = {
      ...formData,
      Id_User: user?.id || user?.Id_User || 0,
    };
    
    if (!isEdit) {
      payload.Rol = "Comprador";
    }

    try {
      setLoading(true);
      if (isEdit) {
        await clienteService.updateCliente(formData.Id_Cliente, payload);
      } else {
        await clienteService.createCliente(payload);
      }
      await loadClientes();
      setFormData(initialClienteData);
      setIsEdit(false);
      setOpenDialog(false);
      setError(null);
    } catch (err) {
      console.error("Error al guardar comprador:", err);
      setError("No se pudo guardar el comprador.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente) => {
    setFormData(cliente);
    setIsEdit(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro que deseas eliminar este comprador?")) {
      try {
        setLoading(true);
        await clienteService.deleteCliente(id);
        await loadClientes();
      } catch (err) {
        console.error("Error al eliminar comprador:", err);
        setError("No se pudo eliminar el comprador.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Lista de Compradores
        </h1>
        <Button onClick={() => { setFormData(initialClienteData); setIsEdit(false); setOpenDialog(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Comprador
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}

      <Card className="bg-card/80 backdrop-blur-sm overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-xl">Compradores ({clientes.length})</CardTitle>
          <CardDescription>Gestión de compradores registrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Municipio</TableHead>
                <TableHead>Localidad</TableHead>
                <TableHead>UPP</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map(cliente => (
                <TableRow key={cliente.Id_Cliente}>
                  <TableCell className="flex gap-2 items-center">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    {cliente.Name}
                  </TableCell>
                  <TableCell>{cliente.Propietario}</TableCell>
                  <TableCell>{cliente.Entidad}</TableCell>
                  <TableCell>{cliente.Municipio}</TableCell>
                  <TableCell>{cliente.Localidad}</TableCell>
                  <TableCell>{cliente.Upp}</TableCell>
                  <TableCell>{cliente.Rol}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(cliente.Id_Cliente)}>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar Comprador" : "Registrar Comprador"}</DialogTitle>
            <DialogDescription>Completa la información del comprador.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                key !== 'Id_User' && key !== 'Id_Cliente' && key !== 'Rol' && (
                  <div className="space-y-2" key={key}>
                    <Label htmlFor={key}>{key}</Label>
                    <Input
                      id={key}
                      name={key}
                      value={formData[key] || ''}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                )
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>{isEdit ? "Actualizar" : "Guardar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CompradoresPage;