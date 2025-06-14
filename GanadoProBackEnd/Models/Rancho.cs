using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        public string Ubicacion { get; set; } // Asignar el email del usuario al rancho
        [ForeignKey("Id_User")]
public User User { get; set; }
        public ICollection<Lote> Lotes { get; set; } = new List<Lote>(); // Relación con Userpublic ICollection<Corrales> Corrales { get; set; }
    }
}