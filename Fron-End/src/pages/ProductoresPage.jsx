
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, UserCheck, Star, TrendingUp } from 'lucide-react';
    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

    const productoresData = [
      { id: 'P001', nombre: 'Rancho El Progreso', contacto: 'Carlos Sánchez', email: 'carlos.sanchez@elprogreso.com', telefono: '+52 777 111 2233', especialidad: 'Cría Angus', reputacion: 4.5, animalesProvistos: 150 },
      { id: 'P002', nombre: 'Finca Santa Fe', contacto: 'Luisa Fernández', email: 'luisa.f@santafe.com', telefono: '+52 222 333 4455', especialidad: 'Genética Hereford', reputacion: 4.8, animalesProvistos: 250 },
      { id: 'P003', nombre: 'Hacienda La Victoria', contacto: 'Roberto Díaz', email: 'roberto.diaz@lavictoria.mx', telefono: '+52 888 555 6677', especialidad: 'Engorde Brangus', reputacion: 4.2, animalesProvistos: 90 },
    ];
    
    const ProductoresPage = () => {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Lista de Productores
            </h1>
            <Button className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all">
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Productor
            </Button>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Productores Asociados ({productoresData.length})</CardTitle>
              <CardDescription>Gestiona la información de tus proveedores de ganado.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre Productor</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Reputación</TableHead>
                    <TableHead>Animales Provistos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productoresData.map((productor) => (
                    <TableRow key={productor.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                             <AvatarImage src={`https://avatar.vercel.sh/${productor.email}.png?text=${productor.nombre.substring(0,1)}`} alt={productor.nombre} />
                            <AvatarFallback>{productor.nombre.substring(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {productor.nombre}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{productor.contacto}</div>
                        <a href={`mailto:${productor.email}`} className="text-xs text-muted-foreground hover:text-primary">{productor.email}</a>
                      </TableCell>
                      <TableCell>{productor.especialidad}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" /> {productor.reputacion}/5
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-400 mr-1" /> {productor.animalesProvistos}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Ver Perfil</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ProductoresPage;
  