
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Eye, Edit, Trash2 } from 'lucide-react';
    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table";
    import { cn } from '@/lib/utils';

    const GanadoTable = ({ data, title, onView, onEdit, onDelete }) => {
      const getStatusClass = (estado) => {
        return cn(`px-2 py-1 text-xs rounded-full`,
          estado === 'Saludable' && 'bg-green-500/20 text-green-400',
          estado === 'Vendido' && 'bg-gray-500/20 text-gray-400',
          estado === 'Enfermo' && 'bg-red-500/20 text-red-400',
          estado === 'Preñada' && 'bg-pink-500/20 text-pink-400',
          estado === 'En engorde' && 'bg-yellow-500/20 text-yellow-400',
          estado === 'Cuarentena' && 'bg-purple-500/20 text-purple-400'
        );
      };

      return (
        <Card className="bg-card/80 backdrop-blur-sm mt-4">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">{title} ({data.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay ganado en esta categoría.</p>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Arete</TableHead>
                    <TableHead>Raza</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((animal) => (
                    <TableRow key={animal.id} className="hover:bg-muted/30 transition-colors">
                      
                      <TableCell>{animal.id}</TableCell>
                      <TableCell>{animal.arete}</TableCell>
                      <TableCell>{animal.raza}</TableCell>
                      <TableCell>{animal.sexo}</TableCell>
                      <TableCell>{animal.edad}</TableCell>
                      <TableCell>{animal.peso}</TableCell>
                      <TableCell>{animal.lote}</TableCell>
                      <TableCell>
                        <span className={getStatusClass(animal.estado)}>
                          {animal.estado}
                        </span>
                      </TableCell>
                      <TableCell>{animal.fechaRegistro}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => onView(animal)} className="hover:text-primary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="ghost" size="icon" onClick={() => onDelete(animal.id)} className="hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      );
    };

    export default GanadoTable;
  