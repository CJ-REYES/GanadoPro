
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Truck, FilePlus, ListChecks, AlertTriangle, CheckSquare } from 'lucide-react';
    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table";
    import { cn } from '@/lib/utils';

    const exportacionesData = [
      { id: 'EXP-001', destino: 'EE.UU.', fechaSalidaEstimada: '2024-06-15', cantidad: 50, raza: 'Angus', estado: 'En Preparación Documental', alerta: null },
      { id: 'EXP-002', destino: 'Canadá', fechaSalidaEstimada: '2024-06-20', cantidad: 30, raza: 'Hereford', estado: 'Cuarentena Iniciada', alerta: 'Vacunación pendiente' },
      { id: 'EXP-003', destino: 'China', fechaSalidaEstimada: '2024-07-01', cantidad: 100, raza: 'Brangus', estado: 'Listo para Embarque', alerta: null },
      { id: 'EXP-004', destino: 'Japón', fechaSalidaEstimada: '2024-07-10', cantidad: 20, raza: 'Wagyu (Referencia)', estado: 'Documentación Aprobada', alerta: null },
    ];

    const getExportStatusIconAndColor = (status) => {
      if (status.includes('Preparación')) return { icon: <FilePlus className="h-4 w-4 mr-2 text-blue-500" />, color: 'text-blue-500 bg-blue-500/10' };
      if (status.includes('Cuarentena')) return { icon: <ListChecks className="h-4 w-4 mr-2 text-yellow-600" />, color: 'text-yellow-600 bg-yellow-600/10' };
      if (status.includes('Listo') || status.includes('Aprobada')) return { icon: <CheckSquare className="h-4 w-4 mr-2 text-green-500" />, color: 'text-green-500 bg-green-500/10' };
      return { icon: <Truck className="h-4 w-4 mr-2 text-gray-500" />, color: 'text-gray-500 bg-gray-500/10' };
    };
    
    const ExportacionPage = () => {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Inventario de Ganado para Exportación
            </h1>
            <Button className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all">
              <Truck className="mr-2 h-4 w-4" /> Nueva Orden de Exportación
            </Button>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Lotes de Exportación ({exportacionesData.length})</CardTitle>
              <CardDescription>Seguimiento de los lotes de ganado destinados a la exportación.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Lote</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Fecha Salida Est.</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Raza Predominante</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Alerta</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportacionesData.map((lote) => {
                    const { icon, color } = getExportStatusIconAndColor(lote.estado);
                    return (
                    <TableRow key={lote.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{lote.id}</TableCell>
                      <TableCell>{lote.destino}</TableCell>
                      <TableCell>{lote.fechaSalidaEstimada}</TableCell>
                      <TableCell>{lote.cantidad}</TableCell>
                      <TableCell>{lote.raza}</TableCell>
                      <TableCell>
                        <span className={cn("px-2 py-1 text-xs rounded-full flex items-center", color)}>
                          {icon} {lote.estado}
                        </span>
                      </TableCell>
                      <TableCell>
                        {lote.alerta ? (
                          <span className="flex items-center text-red-500 text-xs">
                            <AlertTriangle className="h-4 w-4 mr-1" /> {lote.alerta}
                          </span>
                        ) : (
                          <span className="text-green-500 text-xs">Sin alertas</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Gestionar Lote</Button>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ExportacionPage;
  