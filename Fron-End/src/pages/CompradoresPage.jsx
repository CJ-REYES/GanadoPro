
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, User, Mail, Phone, MapPin } from 'lucide-react';
     import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

    const compradoresData = [
      { id: 'C001', nombre: 'Juan Pérez', tipo: 'Nacional', email: 'juan.perez@email.com', telefono: '+52 555 123 4567', ciudad: 'Ciudad de México', ultimaCompra: '2024-05-10', totalCompras: 5 },
      { id: 'C002', nombre: 'Global Cattle Co.', tipo: 'Internacional', email: 'contact@globalcattle.com', telefono: '+1 202 555 0147', ciudad: 'Houston, TX', ultimaCompra: '2024-05-08', totalCompras: 2 },
      { id: 'C003', nombre: 'Ana Gómez', tipo: 'Nacional', email: 'ana.gomez@email.com', telefono: '+52 333 987 6543', ciudad: 'Guadalajara', ultimaCompra: '2024-05-05', totalCompras: 8 },
      { id: 'C004', nombre: 'Exportadora del Sur', tipo: 'Internacional', email: 'info@exportadelsur.net', telefono: '+54 11 5555 0000', ciudad: 'Buenos Aires', ultimaCompra: '2024-04-20', totalCompras: 1 },
    ];
    
    const CompradoresPage = () => {
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
            <Button className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all">
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Comprador
            </Button>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Compradores Registrados ({compradoresData.length})</CardTitle>
              <CardDescription>Gestiona la información de tus compradores nacionales e internacionales.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Últ. Compra</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compradoresData.map((comprador) => (
                    <TableRow key={comprador.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${comprador.email}.png`} alt={comprador.nombre} />
                            <AvatarFallback>{comprador.nombre.substring(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {comprador.nombre}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${comprador.tipo === 'Nacional' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                          {comprador.tipo}
                        </span>
                      </TableCell>
                      <TableCell><a href={`mailto:${comprador.email}`} className="hover:text-primary">{comprador.email}</a></TableCell>
                      <TableCell>{comprador.telefono}</TableCell>
                      <TableCell>{comprador.ciudad}</TableCell>
                      <TableCell>{comprador.ultimaCompra}</TableCell>
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

    export default CompradoresPage;
  