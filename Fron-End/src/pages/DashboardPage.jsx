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
  LayoutGrid,
  Bell,
  Pencil,
  Trash2,
  AlertCircle,
  ShoppingCart,
  LineChart
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
import FormOrdenVenta from '@/components/FormOrdenVenta';
import LoteForm from '@/components/LoteForm';
import {
  getConteoAnimalesEnStock,
  getConteoAnimalesVendidos
} from '@/services/animalService';
import {
  getConteoLotesVendidos,
  getConteoLotesDisponibles
} from '@/services/loteService';
import { getRanchos, getResumenGanado } from '@/services/ranchoService';
import { getActividadesRecientes } from '@/services/actividadesService';
import { useToast } from "@/components/ui/use-toast";

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
  const [openOrdenVenta, setOpenOrdenVenta] = useState(false);
  const [openLote, setOpenLote] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [stats, setStats] = useState({
    animalesStock: 0,
    animalesVendidos: 0,
    lotesVendidos: 0,
    lotesDisponibles: 0
  });

  const [resumenRanchos, setResumenRanchos] = useState([]);
  const [ranchos, setRanchos] = useState([]);
  const [loadingRanchos, setLoadingRanchos] = useState(true);
  const [errorRanchos, setErrorRanchos] = useState(null);

  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorActivities, setErrorActivities] = useState(null);

  const { toast } = useToast();

  const handleSuccess = () => {
    setOpen(false);
    cargarDatosPrincipales();
    toast({
      title: "¡Éxito!",
      description: "El animal ha sido registrado correctamente.",
      variant: "success",
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmitSuccess = () => {
    setOpenLote(false);
    cargarDatosPrincipales();
    toast({
      title: "¡Éxito!",
      description: "El nuevo lote ha sido creado correctamente.",
      variant: "success",
    });
  };

  const handleViewDetail = (activityId) => {
    console.log('Ver detalle de actividad:', activityId);
    toast({
      title: "Detalle de Actividad",
      description: `Ver detalle para la actividad con ID: ${activityId}`,
    });
  };

  // Función actualizada para obtener iconos
  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case 'Registro':
        return <Pencil className="h-5 w-5 text-blue-500" />;
      case 'Actualización':
        return <Pencil className="h-5 w-5 text-yellow-500" />;
      case 'Eliminación':
        return <Trash2 className="h-5 w-5 text-red-500" />;
      case 'Alerta':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Notificación':
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  // Función para obtener el color de la etiqueta de estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400";
      case 'Pendiente':
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400";
      case 'En Progreso':
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400";
      case 'Urgente':
        return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 animate-pulse";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const cargarDatosPrincipales = async () => {
    try {
      setLoadingStats(true);
      setErrorStats(null);

      const [
        conteoAnimalesStock,
        conteoAnimalesVendidos,
        conteoLotesVendidos,
        conteoLotesDisponibles,
        resumenRanchosData
      ] = await Promise.all([
        getConteoAnimalesEnStock(),
        getConteoAnimalesVendidos(),
        getConteoLotesVendidos(),
        getConteoLotesDisponibles(),
        getResumenGanado()
      ]);

      setStats({
        animalesStock: conteoAnimalesStock,
        animalesVendidos: conteoAnimalesVendidos,
        lotesVendidos: conteoLotesVendidos,
        lotesDisponibles: conteoLotesDisponibles
      });

      setResumenRanchos(resumenRanchosData);

    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
      setErrorStats('Error al cargar los datos. Inténtalo de nuevo más tarde.');
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas del dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    const loadRanchos = async () => {
      try {
        setLoadingRanchos(true);
        const data = await getRanchos();
        setRanchos(data);
      } catch (error) {
        console.error('Error al cargar ranchos:', error);
        setErrorRanchos('No se pudieron cargar los ranchos');
        toast({
          title: "Error",
          description: "No se pudieron cargar los ranchos. El formulario de registro de animales podría no funcionar correctamente.",
          variant: "destructive",
        });
      } finally {
        setLoadingRanchos(false);
      }
    };
    loadRanchos();
  }, [toast]);

  useEffect(() => {
    cargarDatosPrincipales();
  }, [toast]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoadingActivities(true);
        const actividades = await getActividadesRecientes();

        const formattedActivities = actividades.map(actividad => ({
          id: actividad.id,
          type: actividad.tipo,
          description: actividad.descripcion,
          time: actividad.tiempo?.toLocaleString() || 'N/A',
          status: actividad.estado,
          action: actividad.accion ? {
            label: 'Ver detalle',
            onClick: () => handleViewDetail(actividad.id)
          } : null,
          icon: getActivityIcon(actividad.tipo)
        }));

        setRecentActivities(formattedActivities);
      } catch (err) {
        setErrorActivities(err.message);
        console.error('Error fetching recent activities:', err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchRecentActivities();
  }, []);

  const formattedRanchos = ranchos.map(rancho => ({
    Id_Rancho: rancho.id_Rancho,
    Nombre: rancho.nombreRancho
  }));

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

  if (loadingStats || loadingActivities) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Cargando dashboard...</p>
      </div>
    );
  }

  if (errorStats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{errorStats}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 min-h-screen p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
        Panel Principal Ganadero
      </motion.h1>

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
            <CardContent className="flex-grow">
              {loadingActivities ? (
                <div className="flex justify-center items-center h-64">
                  <p>Cargando actividades recientes...</p>
                </div>
              ) : errorActivities ? (
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-red-800 dark:text-red-400">Error al cargar actividades: {errorActivities}</p>
                </div>
              ) : recentActivities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No hay actividades recientes para mostrar
                </p>
              ) : (
                <div className="overflow-y-auto max-h-[400px]">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 bg-background">
                        <TableRow>
                          <TableHead className="w-[100px] text-gray-700 dark:text-gray-300">Tipo</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300">Descripción</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300">Tiempo</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300">Estado</TableHead>
                          <TableHead className="text-right text-gray-700 dark:text-gray-300">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivities.map((activity) => (
                          <TableRow
                            key={activity.id}
                            className="transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md border-b border-gray-200 dark:border-gray-700"
                          >
                            {/* Celda de tipo con icono */}
                            <TableCell className="font-medium flex items-center gap-2 py-3">
                              {activity.icon}
                              <span className="font-semibold">{activity.type}</span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400 py-3">{activity.description}</TableCell>
                            <TableCell className="text-sm text-gray-500 dark:text-gray-400 py-3">{activity.time}</TableCell>
                            <TableCell className="py-3">
                              <span
                                className={cn(
                                  "px-3 py-1 text-xs font-semibold rounded-full",
                                  getStatusColor(activity.status)
                                )}
                              >
                                {activity.status}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 text-right">
                              {activity.action && (
                                <Button
                                  variant="ghost"
                                  className="text-blue-600 dark:text-blue-400 p-2 h-auto hover:bg-transparent hover:text-blue-500"
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
                  </div>
                </div>
              )}
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
                    <Pencil className="mr-2 h-4 w-4" /> Registrar Nuevo Animal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Registrar Nuevo Animal</DialogTitle>
                  </DialogHeader>
                  {loadingRanchos ? (
                    <div className="text-center py-4">Cargando ranchos para el formulario...</div>
                  ) : errorRanchos ? (
                    <div className="text-red-500 text-center py-4">{errorRanchos}. Por favor, recarga la página.</div>
                  ) : (
                    <GanadoForm
                      ranchos={formattedRanchos}
                      onSuccess={handleSuccess}
                      onCancel={handleCancel}
                    />
                  )}
                </DialogContent>
              </Dialog>

              <Dialog open={openOrdenVenta} onOpenChange={setOpenOrdenVenta}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full hover:border-blue-500 hover:text-blue-500 transition-colors duration-300 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Crear Orden de Venta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Nueva Orden de Venta</DialogTitle>
                  </DialogHeader>
                  <FormOrdenVenta
                    onClose={() => setOpenOrdenVenta(false)}
                    onSave={() => {
                      setOpenOrdenVenta(false);
                      toast({
                        title: "¡Éxito!",
                        description: "La orden de venta ha sido creada correctamente.",
                        variant: "success",
                      });
                    }}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={openLote} onOpenChange={setOpenLote}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-300 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <LineChart className="mr-2 h-4 w-4" /> Crear Nuevo Lote
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Crear Nuevo Lote</DialogTitle>
                  </DialogHeader>
                  <LoteForm
                    onSubmitSuccess={handleSubmitSuccess}
                    onCancel={() => setOpenLote(false)}
                    isEditing={false}
                  />
                </DialogContent>
              </Dialog>
              <Separator className="my-3 bg-gray-200 dark:bg-gray-700" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Resumen de Ganado por Rancho */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-card/80 backdrop-blur-sm hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-900 dark:text-white">Resumen de Ganado por Rancho</CardTitle>
              <LayoutGrid className="text-primary h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Rancho</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Total Animales</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Hembras</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Machos</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">% Hembras</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">% Machos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resumenRanchos.map((rancho) => (
                    <TableRow key={rancho.id_Rancho} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {rancho.nombreRancho}
                      </TableCell>
                      <TableCell className="font-bold text-gray-900 dark:text-white">
                        {rancho.totalAnimales}
                      </TableCell>
                      <TableCell className="text-pink-500 dark:text-pink-300">
                        {rancho.totalHembras}
                      </TableCell>
                      <TableCell className="text-blue-500 dark:text-blue-300">
                        {rancho.totalMachos}
                      </TableCell>
                      <TableCell>
                        <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 px-2 py-1 rounded-full text-xs">
                          {rancho.totalAnimales > 0
                            ? `${Math.round((rancho.totalHembras / rancho.totalAnimales) * 100)}%`
                            : '0%'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                          {rancho.totalAnimales > 0
                            ? `${Math.round((rancho.totalMachos / rancho.totalAnimales) * 100)}%`
                            : '0%'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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