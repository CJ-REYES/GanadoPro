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
  // Función para obtener clase CSS según el estado
  const getStatusClass = (estado) => {
    return cn(
      `px-2 py-1 text-xs rounded-full`,
      estado === 'EnStock' && 'bg-green-500/20 text-green-400',
      estado === 'Vendido' && 'bg-blue-500/20 text-blue-400',
      estado === 'EnProceso' && 'bg-yellow-500/20 text-yellow-400'
    );
  };

  // Función para obtener clase CSS según la clasificación
  const getClassificationClass = (clasificacion) => {
    return cn(
      `px-2 py-1 text-xs rounded-full`,
      clasificacion === 'Saludable' && 'bg-green-500/20 text-green-400',
      clasificacion === 'Enfermo' && 'bg-red-500/20 text-red-400',
      clasificacion === 'Preñada' && 'bg-pink-500/20 text-pink-400',
      clasificacion === 'En engorde' && 'bg-yellow-500/20 text-yellow-400',
      clasificacion === 'Cuarentena' && 'bg-purple-500/20 text-purple-400'
    );
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm mt-4">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No hay ganado en esta categoría.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arete</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Edad (meses)</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Clasificación</TableHead>
                  <TableHead>Ingreso</TableHead>
                  <TableHead>Rancho</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((animal) => (
                  <TableRow key={animal.Id_Animal} className="hover:bg-muted/30 transition-colors">
                    <TableCell>{animal.Arete}</TableCell>
                    <TableCell>{animal.Raza}</TableCell>
                    <TableCell>{animal.Sexo}</TableCell>
                    <TableCell>{animal.Edad_Meses}</TableCell>
                    <TableCell>{animal.Peso ? `${animal.Peso} kg` : 'N/A'}</TableCell>
                    <TableCell>
                      {animal.Id_Lote ? `Lote ${animal.Id_Lote}` : 'Sin lote'}
                    </TableCell>
                    <TableCell>
                      <span className={getStatusClass(animal.Estado)}>
                        {animal.Estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={getClassificationClass(animal.Clasificacion)}>
                        {animal.Clasificacion}
                      </span>
                    </TableCell>
                    <TableCell>
                      {animal.FechaIngreso ? new Date(animal.FechaIngreso).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>{animal.NombreRancho || 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onView(animal)} 
                        className="hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(animal)} 
                        className="hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(animal.Id_Animal)} 
                        className="hover:text-destructive"
                      >
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