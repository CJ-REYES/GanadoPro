using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
    public class Clientes
    {
        public int Id { get; set; }
        public int IdFierros_Cliente { get; set; }
        public string Name { get; set; }
        public string Propietario { get; set; }
        public string Domicilio { get; set; }
        public string Localidad { get; set; }
        public string Municipio { get; set; }
        public string Entidad { get; set; }
        public string Upp { get; set; }


    }    public class Id
    {
        public int Id_Rancho { get; set; }
        public int Id_Cliente { get; set; } // Relación entre Cliente y Rancho
        public int Id_Fierro { get; set; } // Relación entre Fierro y Rancho    
        public int Id_Rancho_Fierro { get; set; } // Relación entre Rancho y Fierro
        public int Id_Cliente_Rancho { get; set; } // Relación entre Cliente y Rancho
        public int Id_Cliente_Fierro { get; set; } // Relación entre Cliente y Fierro
    }
}