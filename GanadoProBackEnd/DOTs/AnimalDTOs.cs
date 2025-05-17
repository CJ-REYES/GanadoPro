using System.ComponentModel.DataAnnotations;

namespace GanadoProBackEnd.DTOs
{
public class AnimalResponseDto
{
    public int Id_Animal { get; set; }
    public int Arete { get; set; }
    public int Peso { get; set; }
    public string Sexo { get; set; }
    public string Clasificacion { get; set; }
    public string Categoria { get; set; }
    public string Raza { get; set; }
    public int Edad_Meses { get; set; }
    public DateTime Fecha_Registro { get; set; }
    public int Id_Lote { get; set; }
    public string Origen { get; set; }       // Nueva propiedad
    public DateTime? FechaCompra { get; set; } // Nueva propiedad
}

    public class CreateAnimalDto
    {
        [Required(ErrorMessage = "El número de arete es obligatorio")]
        public int Arete { get; set; }

        [Required(ErrorMessage = "El peso es obligatorio")]
        public int Peso { get; set; }

        [Required(ErrorMessage = "El sexo es obligatorio")]
        public string Sexo { get; set; } = null!;

        [Required(ErrorMessage = "La clasificación es obligatoria")]
        public string Clasificacion { get; set; } = null!;

        [Required(ErrorMessage = "La categoría es obligatoria")]
        public string Categoria { get; set; } = null!;

        [Required(ErrorMessage = "La raza es obligatoria")]
        public string Raza { get; set; } = null!;

        [Required(ErrorMessage = "El ID de lote es obligatorio")]
        public int Id_Lote { get; set; }
    }

     public class UpdateAnimalDto
    {
        public int? Arete { get; set; }
        public int? Peso { get; set; }
        public string? Sexo { get; set; }
        public string? Clasificacion { get; set; }
        public string? Categoria { get; set; }
        public string? Raza { get; set; }
        public int? Id_Lote { get; set; }
    }
}