using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GanadoProBackEnd.Models
{
    public class Lote
    {
        public int Id_Lote { get; set; }
        public int Id_User { get; set; } // ID del usuario propietario del lote

        [Required(ErrorMessage = "El ID del rancho es obligatorio")]
        public int Id_Rancho { get; set; } // Ubicación del lote

        [Required(ErrorMessage = "El Remo es obligatorio")]
        public int Remo { get; set; }

        public DateTime Fecha_Entrada { get; set; }
        public DateTime Fecha_Creacion { get; set; } = DateTime.Now;
        public DateTime? Fecha_Salida { get; set; } // Permitir nulos
        public string Estado { get; set; } = "Disponible";
        public string? Observaciones { get; set; }
        public int? Id_Cliente { get; set; }
        // Relaciones
        public User User { get; set; }
        public Rancho Rancho { get; set; }
        public ICollection<Animal> Animales { get; set; }
        public Clientes Cliente { get; set; }  // Nueva relación
     public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
    }
}