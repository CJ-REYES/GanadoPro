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
    [Required]
    public int Arete { get; set; }
    
    [Required]
    public int Peso { get; set; }
    
    [Required]
    public string Sexo { get; set; }
    
    [Required]
    public string Clasificacion { get; set; }
    
    [Required]
    public string Categoria { get; set; }
    
    [Required]
    public string Raza { get; set; }
    
    [Required]
    public int Id_Lote { get; set; }
    
    public string Origen { get; set; } = "Comprado"; // Valor predeterminado
    public DateTime? FechaCompra { get; set; } // Opcional
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