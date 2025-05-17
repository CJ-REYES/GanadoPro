using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;
using System.ComponentModel.DataAnnotations;

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CorralesController : ControllerBase
    {
        private readonly MyDbContext _context;

        public CorralesController(MyDbContext context) => _context = context;

        // GET: api/Corrales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CorralResponseDto>>> GetCorrales()
        {
            return await _context.Corrales
                .Include(c => c.Rancho)
                .Include(c => c.Lotes)
                .Select(c => new CorralResponseDto
                {
                    Id_Corral = c.Id_Corrales,
                    NombreCorral = c.NombreCorral,
                    CapacidadMaxima = c.CapacidadMaxima,
                    TipoGanado = c.TipoGanado,
                    Estado = c.Estado,
                    Id_Rancho = c.Id_Rancho,
                    NombreRancho = c.Rancho.NombreRancho,
                    TotalLotes = c.Lotes.Count,
                    Lotes = c.Lotes.Select(l => new CorralLoteInfoDto
                    {
                        Id_Lote = l.Id_Lote,
                        FechaEntrada = l.Fecha_Entrada,
                        EstadoLote = "" // TODO: Reemplaza con una propiedad existente de Lote, por ejemplo l.AlgunEstado si existe
                    }).ToList()
                })
                .ToListAsync();
        }

        // GET: api/Corrales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CorralResponseDto>> GetCorral(int id)
        {
            var corral = await _context.Corrales
                .Include(c => c.Rancho)
                .Include(c => c.Lotes)
                .FirstOrDefaultAsync(c => c.Id_Corrales == id);

            if (corral == null) return NotFound();

            return new CorralResponseDto
            {
                Id_Corral = corral.Id_Corrales,
                NombreCorral = corral.NombreCorral,
                CapacidadMaxima = corral.CapacidadMaxima,
                TipoGanado = corral.TipoGanado,
                Estado = corral.Estado,
                Id_Rancho = corral.Id_Rancho,
                NombreRancho = corral.Rancho.NombreRancho,
                TotalLotes = corral.Lotes.Count,
                Lotes = corral.Lotes.Select(l => new CorralLoteInfoDto
                {
                    Id_Lote = l.Id_Lote,
                    FechaEntrada = l.Fecha_Entrada,
                    EstadoLote = "" // TODO: Reemplaza con una propiedad existente de Lote, por ejemplo l.AlgunEstado si existe
                }).ToList()
            };
        }

        // POST: api/Corrales (Crear nuevo corral)
        [HttpPost]
        public async Task<ActionResult<CorralResponseDto>> CreateCorral([FromBody] CreateCorralDto corralDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var rancho = await _context.Ranchos.FindAsync(corralDto.Id_Rancho);
            if (rancho == null) return BadRequest("Rancho no encontrado");

            var corral = new Corrales
            {
                Id_Rancho = corralDto.Id_Rancho,
                NombreCorral = corralDto.NombreCorral,
                CapacidadMaxima = corralDto.CapacidadMaxima,
                TipoGanado = corralDto.TipoGanado,
                Estado = "Disponible", // Estado inicial
                Notas = "" // Puedes inicializarlo como quieras
            };

            await _context.Corrales.AddAsync(corral);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCorral), new { id = corral.Id_Corrales }, new CorralResponseDto
            {
                Id_Corral = corral.Id_Corrales,
                NombreCorral = corral.NombreCorral,
                CapacidadMaxima = corral.CapacidadMaxima,
                TipoGanado = corral.TipoGanado,
                Estado = corral.Estado,
                Id_Rancho = corral.Id_Rancho,
                NombreRancho = rancho.NombreRancho,
                TotalLotes = 0
            });
        }

        // PUT: api/Corrales/5 (Actualizar estado para venta)
        [HttpPut("{id}/programar-venta")]
        public async Task<IActionResult> ProgramarVenta(int id, [FromBody] ProgramarVentaDto ventaDto)
        {
            var corral = await _context.Corrales.FindAsync(id);
            if (corral == null) return NotFound();

            // Validar capacidad
            var totalAnimales = await _context.Lotes
                .Where(l => l.Id_Corrales == id)
                .SumAsync(l => l.Animales.Count);

            if (totalAnimales > corral.CapacidadMaxima)
                return BadRequest("Capacidad excedida para programar venta");

            corral.Estado = "Programado para venta";
            corral.Notas = $"Venta programada para: {ventaDto.FechaVenta} - {ventaDto.Observaciones}";

            _context.Entry(corral).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Corrales/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCorral(int id)
        {
            var corral = await _context.Corrales
                .Include(c => c.Lotes)
                .FirstOrDefaultAsync(c => c.Id_Corrales == id);

            if (corral == null) return NotFound();
            if (corral.Lotes.Any()) return BadRequest("No se puede eliminar un corral con lotes asociados");

            _context.Corrales.Remove(corral);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // ======= DTOs =======
    public class CorralResponseDto
    {
        public int Id_Corral { get; set; }
        public string NombreCorral { get; set; }
        public int CapacidadMaxima { get; set; }
        public string TipoGanado { get; set; }
        public string Estado { get; set; }
        public int Id_Rancho { get; set; }
        public string NombreRancho { get; set; }
        public int TotalLotes { get; set; }
        public List<CorralLoteInfoDto> Lotes { get; set; }
    }

    public class CreateCorralDto
    {
        [Required]
        public int Id_Rancho { get; set; }
        
        [Required]
        [StringLength(50)]
        public string NombreCorral { get; set; }
        
        [Range(1, 1000)]
        public int CapacidadMaxima { get; set; }
        
        [Required]
        [StringLength(50)]
        public string TipoGanado { get; set; }
    }

    public class ProgramarVentaDto
    {
        [Required]
        public DateTime FechaVenta { get; set; }
        
        [StringLength(500)]
        public string Observaciones { get; set; }
    }

    public class CorralLoteInfoDto
    {
        public int Id_Lote { get; set; }
        public DateTime FechaEntrada { get; set; }
        public string EstadoLote { get; set; }
    }
}