using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
public class InvetarioExportacion
{
    public int Id_InventarioExportacion { get; set; }
    public DateTime? FechaSalida { get; set; }
    public int Id_Lote { get; set; }
    public int Id_Productor { get; set; }   // FK a Productor
    
    // Propiedades de navegación
    public Lote Lote { get; set; }
    public Productores Productor { get; set; }
}
}