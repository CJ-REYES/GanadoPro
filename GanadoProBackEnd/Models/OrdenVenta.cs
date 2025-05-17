using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
    public class OrdenVenta
    {
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public string Cliente { get; set; }
    public string TipoVenta  { get; set; }
    public int TotalAnimales { get; set; }
    public decimal Monto { get; set; }
    public string EstadoOrden  { get; set; }

    }
}