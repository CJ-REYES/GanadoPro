import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Users, Truck, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GanadoForm from '@/components/ganado/GanadoForm'; // ajusta la ruta si es diferente

const StatCard = ({ title, value, icon: Icon, color, description, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    className="h-full"
  >
    <Card className="bg-card/80 backdrop-blur-sm hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn('h-5 w-5', color)} />
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
        {trend && (
          <div className={cn("text-xs flex items-center mt-1", trend.startsWith('+') ? "text-green-500" : "text-red-500")}>
            {trend.startsWith('+') ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const recentActivities = [
  { id: 1, type: "Venta", description: "Venta de 5 novillos a Comprador X", time: "Hace 2 horas", status: "Completado" },
  { id: 2, type: "Registro", description: "Nuevo lote de 20 terneros registrado", time: "Hace 5 horas", status: "Pendiente" },
  { id: 3, type: "Movimiento", description: "Traslado de 10 vacas al Corral C5", time: "Ayer", status: "En Progreso" },
  { id: 4, type: "Alerta", description: "Bajo nivel de alimento en Corral A2", time: "Ayer", status: "Urgente", icon: <AlertTriangle className="h-4 w-4 text-destructive" /> },
];

const DashboardPage = () => {
  const [open, setOpen] = useState(false);

  // Puedes cargar ranchos desde una API o definirlos estáticamente por ahora
  const ranchos = [
    { Id_Rancho: 1, Nombre: 'Rancho El Sol' },
    { Id_Rancho: 2, Nombre: 'Rancho La Luna' },
  ];

  const handleSuccess = (nuevoAnimal) => {
    console.log("Animal registrado con éxito:", nuevoAnimal);
    setOpen(false); // cierra el modal
    // Aquí puedes refrescar una lista si es necesario
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const stats = [
    { title: "Total Ganado", value: "1,234", icon: Package, color: "text-primary", description: "Cabezas activas", trend: "+2.1% mensual" },
    { title: "Ventas Pendientes (Nal.)", value: "25", icon: DollarSign, color: "text-green-400", description: "Valor: $15,000", trend: "+5 órdenes esta semana" },
    { title: "Ventas Pendientes (Intl.)", value: "8", icon: Truck, color: "text-blue-400", description: "Valor: $45,000", trend: "-2 órdenes esta semana" },
    { title: "Corrales Ocupados", value: "32/50", icon: Users, color: "text-orange-400", description: "64% de ocupación", trend: "+3 corrales ocupados" },
  ];

  return (
    <div className="space-y-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Panel Principal Ganadero
      </motion.h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tiempo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium flex items-center">
                        {activity.icon && <span className="mr-2">{activity.icon}</span>}
                        {activity.type}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{activity.description}</TableCell>
                      <TableCell className="text-muted-foreground">{activity.time}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          activity.status === "Completado" && "bg-green-500/20 text-green-400",
                          activity.status === "Pendiente" && "bg-yellow-500/20 text-yellow-400",
                          activity.status === "En Progreso" && "bg-blue-500/20 text-blue-400",
                          activity.status === "Urgente" && "bg-red-500/20 text-red-400 animate-pulse"
                        )}>
                          {activity.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all duration-300 transform hover:scale-105">
                    Registrar Nuevo Animal
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Registrar Nuevo Animal</DialogTitle>
                  </DialogHeader>
                  <GanadoForm ranchos={ranchos} onSuccess={handleSuccess} onCancel={handleCancel} />
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full hover:border-primary hover:text-primary transition-colors duration-300">Crear Orden de Venta</Button>
              <Button variant="secondary" className="w-full hover:bg-accent/80 transition-colors duration-300">Ver Inventario de Corrales</Button>
              <Separator className="my-3 bg-border/50" />
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary transition-colors duration-300">Generar Reporte Mensual</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-4"
      >
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Resumen de Ganado por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">600</p>
                <p className="text-sm text-muted-foreground">Machos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-400">550</p>
                <p className="text-sm text-muted-foreground">Hembras</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">84</p>
                <p className="text-sm text-muted-foreground">Terneros</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">120</p>
                <p className="text-sm text-muted-foreground">Vendidos (Últ. Mes)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
};

export default DashboardPage;