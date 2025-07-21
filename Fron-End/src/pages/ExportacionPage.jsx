// src/pages/ExportacionPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { ChevronDown, ChevronUp, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import * as ventasService from '@/services/ventasService';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExportacionPage = () => {
  const { toast } = useToast();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVenta, setExpandedVenta] = useState(null);
  const [expandedLotes, setExpandedLotes] = useState({});
  const [animalesLoading, setAnimalesLoading] = useState({});
  const [filter, setFilter] = useState('todas');

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const ventasData = await ventasService.getVentasCompletadas();
        setVentas(ventasData);
      } catch (error) {
        toast({
          title: "Error al cargar ventas",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  const toggleExpandVenta = (ventaId) => {
    setExpandedVenta(expandedVenta === ventaId ? null : ventaId);
    setExpandedLotes({});
  };

  const toggleExpandLote = async (ventaId, loteId) => {
    const key = `${ventaId}-${loteId}`;
    const isExpanded = expandedLotes[key];
    
    const newExpandedLotes = { ...expandedLotes };
    
    if (isExpanded) {
      delete newExpandedLotes[key];
    } else {
      newExpandedLotes[key] = true;
      
      const venta = ventas.find(v => v.id_Venta === ventaId);
      const lote = venta?.lotes.find(l => l.id_Lote === loteId);
      
      if (lote && !lote.animales) {
        try {
          setAnimalesLoading(prev => ({ ...prev, [key]: true }));
          const animales = await ventasService.getAnimalesLote(loteId);
          
          setVentas(prevVentas => 
            prevVentas.map(venta => {
              if (venta.id_Venta === ventaId) {
                const updatedLotes = venta.lotes.map(lote => 
                  lote.id_Lote === loteId 
                    ? { ...lote, animales } 
                    : lote
                );
                return { ...venta, lotes: updatedLotes };
              }
              return venta;
            })
          );
        } catch (error) {
          toast({
            title: "Error al cargar animales",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setAnimalesLoading(prev => ({ ...prev, [key]: false }));
        }
      }
    }
    
    setExpandedLotes(newExpandedLotes);
  };

  const filteredVentas = ventas.filter(venta => {
    if (filter === 'todas') return true;
    return venta.tipoVenta === (filter === 'nacionales' ? 'Nacional' : 'Internacional');
  });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Órdenes de Venta Completadas
        </h1>
        
        <Tabs value={filter} onValueChange={setFilter} className="w-fit">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="nacionales">Nacionales</TabsTrigger>
            <TabsTrigger value="internacionales">Internacionales</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Ventas Completadas</CardTitle>
          <CardDescription>Todas las ventas finalizadas con sus lotes y animales</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ) : filteredVentas.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Ghost className="mx-auto h-12 w-12 mb-4" />
              <p className="font-medium">No hay ventas completadas registradas.</p>
              <p className="text-sm mt-2">
                Las ventas aparecerán aquí cuando se completen los procesos de venta.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Venta</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Lotes</TableHead>
                    <TableHead>Animales</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVentas.map((venta) => (
                    <React.Fragment key={venta.id_Venta}>
                      <TableRow>
                        <TableCell className="font-semibold">OV-{venta.id_Venta}</TableCell>
                        <TableCell>
                          {venta.fechaSalida.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{venta.cliente}</div>
                          <div className="text-xs text-muted-foreground">{venta.upp}</div>
                        </TableCell>
                        <TableCell>{venta.lotes.length}</TableCell>
                        <TableCell>
                          {venta.lotes.reduce((sum, lote) => sum + lote.cantidadAnimales, 0)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            venta.tipoVenta === 'Internacional' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {venta.tipoVenta}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleExpandVenta(venta.id_Venta)}
                          >
                            {expandedVenta === venta.id_Venta ? (
                              <>
                                <ChevronUp className="mr-1 h-4 w-4" /> Ocultar
                              </>
                            ) : (
                              <>
                                <ChevronDown className="mr-1 h-4 w-4" /> Detalles
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {expandedVenta === venta.id_Venta && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <h4 className="font-semibold text-sm mb-1">Folio Guía Remo</h4>
                                  <p>{venta.folioGuiaRemo}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm mb-1">Fecha de Salida</h4>
                                  <p>{venta.fechaSalida.toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm mb-1">Estado</h4>
                                  <p className="text-green-600 font-medium">{venta.estado}</p>
                                </div>
                              </div>
                              
                              <h4 className="font-semibold mb-3">Lotes Vendidos</h4>
                              <div className="space-y-3">
                                {venta.lotes.map((lote) => (
                                  <div 
                                    key={lote.id_Lote} 
                                    className="border rounded-lg overflow-hidden"
                                  >
                                    <div
                                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                      onClick={() => toggleExpandLote(venta.id_Venta, lote.id_Lote)}
                                    >
                                      <div className="space-y-1">
                                        <div className="font-semibold">Lote #{lote.remO}</div>
                                        <div className="text-sm text-muted-foreground">
                                          Comunidad: {lote.comunidad} | Animales: {lote.cantidadAnimales}
                                        </div>
                                      </div>
                                      <div>
                                        <Button variant="ghost" size="icon">
                                          {expandedLotes[`${venta.id_Venta}-${lote.id_Lote}`] ? (
                                            <ChevronUp className="h-5 w-5" />
                                          ) : (
                                            <ChevronDown className="h-5 w-5" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    {expandedLotes[`${venta.id_Venta}-${lote.id_Lote}`] && (
                                      <div className="border-t bg-white dark:bg-gray-900">
                                        {animalesLoading[`${venta.id_Venta}-${lote.id_Lote}`] ? (
                                          <div className="p-4 flex justify-center">
                                            <Skeleton className="h-8 w-full max-w-md" />
                                          </div>
                                        ) : (
                                          <div className="p-4 overflow-x-auto">
                                            {lote.animales?.length > 0 ? (
                                              <Table>
                                                <TableHeader>
                                                  <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead>Arete</TableHead>
                                                    <TableHead>Raza</TableHead>
                                                    <TableHead>Peso</TableHead>
                                                    <TableHead>Sexo</TableHead>
                                                    <TableHead>Fecha salida</TableHead>
                                                  </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                  {lote.animales.map((animal) => (
                                                    <TableRow key={animal.id_Animal}>
                                                      <TableCell>{animal.id_Animal}</TableCell>
                                                      <TableCell>{animal.arete}</TableCell>
                                                      <TableCell>{animal.raza}</TableCell>
                                                      <TableCell>{animal.peso} kg</TableCell>
                                                      <TableCell>{animal.sexo}</TableCell>
                                                      <TableCell>
                                                        {animal.fechaSalida ? animal.fechaSalida.toLocaleDateString() : 'N/A'}
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            ) : (
                                              <p className="text-center text-muted-foreground py-4">
                                                No hay animales registrados en este lote
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExportacionPage;