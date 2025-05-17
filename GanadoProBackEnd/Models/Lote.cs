using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using GanadoProBackEnd.Models;

namespace GanadoProBackEnd.Models
{
    public class Lote
    {

        public int Id_Lote { get; set; }
        [Required]
        public int Id_Corrales { get; set; }
        [Required(ErrorMessage = "El nombre del Rancho es obligatorio")]
        [StringLength(50, ErrorMessage = "El nombre del lote no puede exceder los 50 caracteres")]

        public int Remo { get; set; }
        public DateTime Fecha_Entrada { get; set; }

        public DateTime Fecha_Salida { get; set; }
        public string Upp { get; set; }
        public string Comunidad { get; set; }
        public string Estado { get; set; } = "Disponible"; // Ej: "Disponible", "Reservado", "Vendido"
        public string? ObservacionesVenta { get; set; }

        // Propiedades de navegación
        public Corrales corrales { get; set; }
        public ICollection<Animal> Animales { get; set; }
        public List<Venta> Ventas { get; set; } // Relación inversa
   
    }
}