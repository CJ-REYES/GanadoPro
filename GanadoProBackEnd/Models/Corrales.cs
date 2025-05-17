namespace GanadoProBackEnd.Models
{
    public class Corrales
    {
        public int Id_Corrales { get; set; }
        public int Id_Rancho { get; set; } // FK a Rancho
        public string NombreCorral { get; set; } // Nombre del corral
        public int CapacidadMaxima { get; set; } // Capacidad máxima del corral
        public string TipoGanado { get; set; } // Tipo de ganado en el corral (ej. Bovino, Caprino, etc.)
        public String Estado { get; set; } // Estado del corral (ej. Activo, Inactivo)
        public string Notas { get; set; } // Notas adicionales sobre el corral

        public Rancho Rancho { get; set; } // Relación con Rancho
        public ICollection<Lote> Lotes { get; set; } // Relación con Lote
    }
}