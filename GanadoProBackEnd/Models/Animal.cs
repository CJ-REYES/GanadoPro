using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
    public class Animal
    {
      
        public int Id_Animal { get; set; }
        public int Id_Rancho { get; set; }
        public int Arete { get; set; }
        public int Peso { get; set; }
        public string Sexo { get; set; }      // H = HEMBRA, M = MACHO
        public string Clasificacion { get; set; } // clasificacion para segun la empresa
        public string Categoria { get; set; } // su clasificacion segun su edad
        public string Raza { get; set; }
        public int Edad_Meses { get; set; }
        public DateTime Fecha_Registro { get; set; } = DateTime.Now; // Inicializa con la fecha actual
        public string Origen { get; set; } = "Comprado"; // "Comprado", "Nacido en el rancho"
        public DateTime? FechaCompra { get; set; }
        // FK a Lote
        
        public int? Id_Lote { get; set; }      // Nueva propiedad para la relación
        public Rancho Rancho { get; set; } // Propiedad de navegación
        public Lote Lote { get; set; }        // Propiedad de navegación
    }
}