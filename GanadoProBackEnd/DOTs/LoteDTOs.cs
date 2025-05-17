using System.ComponentModel.DataAnnotations;
using GanadoProBackEnd.DTOs;

namespace GanadoProBackEnd.DTOs
{
    // Para crear un lote
   // CreateLoteDto
public class CreateLoteDto
    {
        [Required]
        public int Id_Rancho { get; set; }

        [Required]
        public int Remo { get; set; }

        [Required]
        public DateTime Fecha_Entrada { get; set; }

        public DateTime Fecha_Salida { get; set; }

        [Required]
        public string Upp { get; set; }

        [Required]
        public string Comunidad { get; set; }
    }
// UpdateLoteDto
public class UpdateLoteDto
    {
        public string? NombreRancho { get; set; }
        public int? Remo { get; set; }
        public DateTime? Fecha_Entrada { get; set; }
        public DateTime? Fecha_Salida { get; set; }
        public string? Upp { get; set; }
        public string? Comunidad { get; set; }
    }

// LoteResponseDto
 public class LoteResponseDto
    {
        public int Id_Lote { get; set; }
        public int Id_Rancho { get; set; }
        public string NombreRancho { get; set; }
        public int Remo { get; set; }
        public DateTime Fecha_Entrada { get; set; }
        public DateTime Fecha_Salida { get; set; }
        public string Upp { get; set; }
        public string Comunidad { get; set; }
        public int TotalAnimales { get; set; }
        public List<AnimalResponseDto> Animales { get; set; } = new List<AnimalResponseDto>();
    }


}
