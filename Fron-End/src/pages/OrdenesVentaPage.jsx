
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, FileText, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { cn } from '@/lib/utils';

    const ordenesData = [
      { id: 'OVN-001', fecha: '2024-05-10', cliente: 'Juan Pérez (Nacional)', tipo: 'Nacional', totalAnimales: 5, monto: '$2,500', estado: 'Pendiente de Pago' },
      { id: 'OVI-001', fecha: '2024-05-08', cliente: 'Global Cattle Co. (Internacional)', tipo: 'Internacional', totalAnimales: 50, monto: '$35,000', estado: 'En Preparación' },
      { id: 'OVN-002', fecha: '2024-05-05', cliente: 'Ana Gómez (Nacional)', tipo: 'Nacional', totalAnimales: 2, monto: '$900', estado: 'Entregado' },
      { id: 'OVI-002', fecha: '2024-04-20', cliente: 'Exportadora del Sur (Internacional)', tipo: 'Internacional', totalAnimales: 100, monto: '$72,000', estado: 'En Tránsito' },
      { id: 'OVN-003', fecha: '2024-05-12', cliente: 'Finca La Esperanza (Nacional)', tipo: 'Nacional', totalAnimales: 10, monto: '$4,800', estado: 'Cancelado' },
    ];

    const getStatusIconAndColor = (status) => {
      switch (status) {
        case 'Pendiente de Pago': return { icon: <Clock className="h-4 w-4 mr-2 text-yellow-500" />, color: 'text-yellow-500 bg-yellow-500/10' };
        case 'En Preparación': return { icon: <Truck className="h-4 w-4 mr-2 text-blue-500" />, color: 'text-blue-500 bg-blue-500/10' };
        case 'Entregado': return { icon: <CheckCircle className="h-4 w-4 mr-2 text-green-500" />, color: 'text-green-500 bg-green-500/10' };
        case 'En Tránsito': return { icon: <Truck className="h-4 w-4 mr-2 text-purple-500" />, color: 'text-purple-500 bg-purple-500/10 animate-pulse' };
        case 'Cancelado': return { icon: <XCircle className="h-4 w-4 mr-2 text-red-500" />, color: 'text-red-500 bg-red-500/10' };
        default: return { icon: <FileText className="h-4 w-4 mr-2 text-gray-500" />, color: 'text-gray-500 bg-gray-500/10' };
      }
    };
    
    const OrdenesVentaPage = () => {

      const OrdenesTable = ({ data, title }) => (
        <Card className="bg-card/80 backdrop-blur-sm mt-4">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">{title} ({data.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay órdenes en esta categoría.</p>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Orden</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Animales</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((orden) => {
                  const { icon, color } = getStatusIconAndColor(orden.estado);
                  return (
                    <TableRow key={orden.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{orden.id}</TableCell>
                      <TableCell>{orden.fecha}</TableCell>
                      <TableCell className="max-w-xs truncate" title={orden.cliente}>{orden.cliente}</TableCell>
                      <TableCell>{orden.totalAnimales}</TableCell>
                      <TableCell>{orden.monto}</TableCell>
                      <TableCell>
                        <span className={cn("px-2 py-1 text-xs rounded-full flex items-center", color)}>
                          {icon} {orden.estado}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Ver Detalles</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      );

      const nacionales = ordenesData.filter(o => o.tipo === 'Nacional');
      const internacionales = ordenesData.filter(o => o.tipo === 'Internacional');
      const todas = ordenesData;


      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Órdenes de Venta
            </h1>
            <Button className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all">
              <PlusCircle className="mr-2 h-4 w-4" /> Nueva Orden de Venta
            </Button>
          </div>
          
          <Tabs defaultValue="todas" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="todas">Todas las Órdenes</TabsTrigger>
              <TabsTrigger value="nacionales">Ventas Nacionales</TabsTrigger>
              <TabsTrigger value="internacionales">Ventas Internacionales</TabsTrigger>
            </TabsList>
            <TabsContent value="todas">
              <OrdenesTable data={todas} title="Todas las Órdenes de Venta" />
            </TabsContent>
            <TabsContent value="nacionales">
              <OrdenesTable data={nacionales} title="Órdenes de Venta Nacionales" />
            </TabsContent>
            <TabsContent value="internacionales">
              <OrdenesTable data={internacionales} title="Órdenes de Venta Internacionales" />
            </TabsContent>
          </Tabs>

        </motion.div>
      );
    };

    export default OrdenesVentaPage;
  