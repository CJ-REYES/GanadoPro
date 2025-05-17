using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;    

namespace GanadoProBackEnd.Models
{
    public class Rancho
    {
        [Required]
        public int Id_Rancho { get; set; }
        [Required]
        public int Id_User { get; set; } // FK a User
        [Required(ErrorMessage = "El nombre del rancho es obligatorio")]
        [StringLength(50, ErrorMessage = "El nombre del rancho no puede exceder los 50 caracteres")]
        public string NombreRancho { get; set; }
        public string Ubicacion { get; set; }
        public string Propietario { get; set; }
        public string Telefono { get; set; }
        public string CorreoElectronico { get; set; }
        public string TipoGanado { get; set; } // Ejemplo: "Bovino", "Caprino", etc.
        public int CapacidadMaxima { get; set; } // Capacidad máxima del rancho

        public User User { get; set; } // Relación con User
        public ICollection<Lote> Lotes { get; set; } // Relación con Lote
    }
}