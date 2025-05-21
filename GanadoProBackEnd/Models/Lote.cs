using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GanadoProBackEnd.Models
{
    public class Lote
    {
        public int Id_Lote { get; set; }

        [Required(ErrorMessage = "El ID del rancho es obligatorio")]
        public int Id_Rancho { get; set; }

        [Required(ErrorMessage = "El Remo es obligatorio")]
        public int Remo { get; set; }

        public DateTime Fecha_Entrada { get; set; }
        public DateTime Fecha_Creacion { get; set; } = DateTime.Now;
        public DateTime? Fecha_Salida { get; set; } // Permitir nulos
        public string Estado { get; set; } = "Disponible";
        public string? Observaciones { get; set; }

        // Relaciones
        public Rancho Rancho { get; set; }
        public ICollection<Animal> Animales { get; set; }
        public List<Venta> Ventas { get; set; }
    }
}