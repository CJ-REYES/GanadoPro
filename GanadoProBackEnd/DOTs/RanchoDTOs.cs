using System.ComponentModel.DataAnnotations;

namespace GanadoProBackEnd.DTOs
{
    public class CreateRanchoDto
    {
        [Required]
        public int Id_User { get; set; }
        
        [Required]
        [StringLength(50)]
        public string NombreRancho { get; set; }
        
        [StringLength(100)]
        public string Ubicacion { get; set; }
        
        [StringLength(50)]
        public string Propietario { get; set; }
        
        [StringLength(20)]
        public string Telefono { get; set; }
        
        [EmailAddress]
        public string CorreoElectronico { get; set; }
        
        [StringLength(50)]
        public string TipoGanado { get; set; }
        
        [Range(1, 100000)]
        public int CapacidadMaxima { get; set; }
    }

    namespace GanadoProBackEnd.DTOs
{
    public class UpdateRanchoDto
    {
        public string? NombreRancho { get; set; }
        public string? Ubicacion { get; set; }
        public string? Propietario { get; set; }
        public string? Telefono { get; set; }
        public string? CorreoElectronico { get; set; }
        public string? TipoGanado { get; set; }
        public int? CapacidadMaxima { get; set; }
    }
}
}