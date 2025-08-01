using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GanadoProBackEnd.Models
{
    public class Actividad
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Tipo { get; set; } // Ej: Venta, Registro, Movimiento, Alerta

        [Required]
        [StringLength(255)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime Tiempo { get; set; } = DateTime.Now;

        [StringLength(50)]
        public string? Estado { get; set; } // Ej: Completado, Pendiente, Urgente

        [StringLength(100)]
        public string? Accion { get; set; } // Ej: Crear Orden de Venta

        // FK para el usuario
        public int? UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public virtual User? Usuario { get; set; }

        // FK para entidad relacionada (opcional)
        public int? EntidadId { get; set; }

        [StringLength(100)]
        public string? TipoEntidad { get; set; } // Ej: Venta, Animal, Lote
    }
}