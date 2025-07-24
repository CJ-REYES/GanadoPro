import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DollarSign, 
  Package, 
  Users, 
  Truck, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Beef,
  PiggyBank,
  Baby,
  ShoppingCart
} from 'lucide-react';
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
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import GanadoForm from '@/components/ganado/GanadoForm';
import { 
  getConteoAnimalesEnStock, 
  getConteoAnimalesVendidos 
} from '@/services/animalService';
import { 
  getConteoLotesVendidos, 
  getConteoLotesDisponibles 
} from '@/services/loteService';

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

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    animalesStock: 0,
    animalesVendidos: 0,
    lotesVendidos: 0,
    lotesDisponibles: 0
  });
  const [ranchos] = useState([
    { Id_Rancho: 1, Nombre: 'Rancho El Sol' },
    { Id_Rancho: 2, Nombre: 'Rancho La Luna' },
  ]);

  const handleSuccess = (nuevoAnimal) => {
    console.log("Animal registrado con éxito:", nuevoAnimal);
    setOpen(false);
    // Recargar datos después de registrar un nuevo animal
    cargarDatos();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        conteoAnimalesStock, 
        conteoAnimalesVendidos,
        conteoLotesVendidos,
        conteoLotesDisponibles
      ] = await Promise.all([
        getConteoAnimalesEnStock(),
        getConteoAnimalesVendidos(),
        getConteoLotesVendidos(),
        getConteoLotesDisponibles()
      ]);

      setStats({
        animalesStock: conteoAnimalesStock,
        animalesVendidos: conteoAnimalesVendidos,
        lotesVendidos: conteoLotesVendidos,
        lotesDisponibles: conteoLotesDisponibles
      });

    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
      setError('Error al cargar los datos. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const recentActivities = [
    { 
      id: 1, 
      type: "Venta", 
      description: "Venta de 5 novillos a Comprador X", 
      time: "Hace 2 horas", 
      status: "Completado",
      action: { label: "Crear Orden de Venta", onClick: () => alert('Creando orden de venta...') }
    },
    { 
      id: 2, 
      type: "Registro", 
      description: "Nuevo lote de 20 terneros registrado", 
      time: "Hace 5 horas", 
      status: "Pendiente",
      action: { label: "Ver Inventario de Corrales", onClick: () => alert('Mostrando inventario...') }
    },
    { 
      id: 3, 
      type: "Movimiento", 
      description: "Traslado de 10 vacas al Corral C5", 
      time: "Ayer", 
      status: "En Progreso",
      action: { label: "Generar Registro Mensual", onClick: () => alert('Generando registro...') }
    },
    { 
      id: 4, 
      type: "Alerta", 
      description: "Bajo nivel de alimento en Corral A2", 
      time: "Ayer", 
      status: "Urgente", 
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      action: null
    },
  ];

  const ganadoStats = [
    { value: "600", label: "Machos", icon: Beef, color: "text-blue-500" },
    { value: "550", label: "Hembras", icon: PiggyBank, color: "text-pink-500" },
    { value: "84", label: "Terneros", icon: Baby, color: "text-yellow-500" },
    { value: "120", label: "Vendidos (Últ. Mes)", icon: ShoppingCart, color: "text-green-500" },
  ];

  const statsCards = [
    { 
      title: "Animales en Stock", 
      value: stats.animalesStock, 
      icon: Package, 
      color: "text-primary", 
      description: "Cabezas activas"
       
    },
    { 
      title: "Animales Vendidos", 
      value: stats.animalesVendidos, 
      icon: DollarSign, 
      color: "text-green-400", 
      description: "Total vendidos", 
     
    },
    { 
      title: "Lotes Disponibles", 
      value: stats.lotesDisponibles, 
      icon: Users, 
      color: "text-orange-400", 
      description: "Lotes en stock", 
     
    },
    { 
      title: "Lotes Vendidos", 
      value: stats.lotesVendidos, 
      icon: Truck, 
      color: "text-blue-400", 
      description: "Total vendidos", 
     
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6  text-gray-900 dark:text-gray-100 min-h-screen p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Panel Principal Ganadero
      </motion.h1>
      
      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad Reciente */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card/80 backdrop-blur-sm hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Tipo</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Descripción</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Tiempo</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Estado</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium flex items-center">
                        {activity.icon && <span className="mr-2">{activity.icon}</span>}
                        {activity.type}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{activity.description}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{activity.time}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          activity.status === "Completado" && "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400",
                          activity.status === "Pendiente" && "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400",
                          activity.status === "En Progreso" && "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400",
                          activity.status === "Urgente" && "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 animate-pulse"
                        )}>
                          {activity.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {activity.action && (
                          <Button 
                            variant="link" 
                            className="text-blue-600 dark:text-blue-400 p-0 h-auto"
                            onClick={activity.action.onClick}
                          >
                            {activity.action.label}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Acciones Rápidas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-600/90 hover:to-cyan-500/90 transition-all duration-300 transform hover:scale-105 text-white">
                    Registrar Nuevo Animal
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Registrar Nuevo Animal</DialogTitle>
                  </DialogHeader>
                  <GanadoForm 
                    ranchos={ranchos} 
                    onSuccess={handleSuccess} 
                    onCancel={handleCancel} 
                  />
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                className="w-full hover:border-blue-500 hover:text-blue-500 transition-colors duration-300 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300"
              >
                Crear Orden de Venta
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-300 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                Ver Inventario de Corrales
              </Button>
              
              <Separator className="my-3 bg-gray-200 dark:bg-gray-700" />
              
              <Button 
                variant="ghost" 
                className="w-full text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
              >
                Generar Reporte Mensual
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Resumen de Ganado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-4"
      >
        <Card className="bg-card/80 backdrop-blur-sm hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Resumen de Ganado por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {ganadoStats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/70 transition-colors"
                >
                  <div className="flex justify-center">
                    <stat.icon className={cn("h-8 w-8", stat.color)} />
                  </div>
                  <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <footer className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8 pb-4">
        Sistema Ganadero v1.0 © {new Date().getFullYear()} - Todos los derechos reservados
      </footer>
    </div>
  );
};

export default DashboardPage;