using System.ComponentModel.DataAnnotations;

namespace GanadoProBackEnd.Models
{
    public class User
    {
        public int Id_User { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Name { get; set; }

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de email inválido")]
        public string Email { get; set; }

        public string Telefono { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public string Upp { get; set; } // Corregido a "Upp"
        public UserRole Rol { get; set; } // Corregido a "Rol"
        public ICollection<Rancho> Ranchos { get; set; }
    }

    public enum UserRole
{
    Admin,
    Business,
    User
}
}