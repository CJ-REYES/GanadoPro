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
        public int Id_Rancho { get; set; } 
        [Required(ErrorMessage = "El nombre del Rancho es obligatorio")]
        [StringLength(50, ErrorMessage = "El nombre del lote no puede exceder los 50 caracteres")]
        
        public string NombreRancho { get; set; }
       
        public int Remo { get; set; }
        [Required(ErrorMessage = "El peso es obligatorio")]
        [Range(1, 2000, ErrorMessage = "El peso debe estar entre 1 y 2000")]
        public DateTime Fecha_Entrada { get; set; }
   
        public DateTime Fecha_Salida { get; set; }
        public string Upp { get; set; }
        public string Comunidad { get; set; }

        // Propiedades de navegación
        public Rancho Rancho { get; set; }
        public ICollection<Animal> Animales { get; set; }
   
    }
}