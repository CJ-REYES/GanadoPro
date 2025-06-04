using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
    public class InvetarioExportacion
    {
        public int Id { get; set; }
        public DateTime? FechaSalida { get; set; }
        public int Id_Lote { get; set; }
        public string Productor { get; set; }
        
        
        
    }
}