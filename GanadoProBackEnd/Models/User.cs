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
        public string Upp { get; set; }
   

        public ICollection<Rancho> Ranchos { get; set; }
        public ICollection<Lote> Lotes { get; set; }
        public ICollection<Clientes> Clientes { get; set; }
        
        public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
        public ICollection<Animal> Animals { get; set; }
    }
  

}