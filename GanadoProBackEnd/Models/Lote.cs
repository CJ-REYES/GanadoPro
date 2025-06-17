using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GanadoProBackEnd.Models
{
    public class Lote
    {
        public int Id_Lote { get; set; }
        public int Id_User { get; set; } // ID del usuario propietario del lote
        public int? Id_Rancho { get; set; } // ID del rancho al que pertenece el lote
     
        [Required(ErrorMessage = "El Remo es obligatorio")]
        public int Remo { get; set; }

        public DateTime Fecha_Entrada { get; set; }
        public DateTime Fecha_Creacion { get; set; } = DateTime.Now;
        public DateTime? Fecha_Salida { get; set; } // el estado depende de esta fecha, si no tiene fecha de salida, está disponible, cuando la tiene, se considera en proceso de venta hasta que se llege la fecha de salida se considera vendido
        public required string Estado { get; set; } = "Disponible"; //en proceso de venta, vendido, etc.
        public string? Observaciones { get; set; }
        public int? Id_Cliente { get; set; }
        // Relaciones
        public required User User { get; set; }
        public required ICollection<Animal> Animales { get; set; }
        public Clientes? Cliente { get; set; }  // Nueva relación
        public Rancho? Rancho { get; set; } // Relación con Rancho
     public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
    }
}