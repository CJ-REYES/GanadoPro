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
    public class LotesController : ControllerBase
    {
        private readonly MyDbContext _context;

        public LotesController(MyDbContext context) => _context = context;

        // GET: Todos los lotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoteResponseDto>>> GetLotes()
        {
            return await _context.Lotes
                .Include(l => l.Rancho)
                .Include(l => l.Animales)
                .Select(l => new LoteResponseDto
                {
                    Id_Lote = l.Id_Lote,
                    NombreRancho = l.Rancho.NombreRancho,
                    Comunidad = l.Rancho.Ubicacion,
                    Estado = l.Estado,
                    TotalAnimales = l.Animales.Count,
                    FechaCreacion = l.Fecha_Creacion
                })
                .ToListAsync();
        }

        // GET: Lote por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<LoteResponseDto>> GetLote(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.Rancho)
                .Include(l => l.Animales)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);

            if (lote == null) return NotFound();

            return new LoteResponseDto
            {
                Id_Lote = lote.Id_Lote,
                NombreRancho = lote.Rancho.NombreRancho,
                Comunidad = lote.Rancho.Ubicacion,
                Estado = lote.Estado,
                TotalAnimales = lote.Animales.Count,
                FechaCreacion = lote.Fecha_Creacion
            };
        }

        // GET: Lotes disponibles para venta
        [HttpGet("disponibles")]
        public async Task<ActionResult<IEnumerable<LoteResponseDto>>> GetLotesDisponibles()
        {
            return await _context.Lotes
                .Where(l => l.Estado == "Disponible")
                .Include(l => l.Rancho)
                .Select(l => new LoteResponseDto
                {
                    Id_Lote = l.Id_Lote,
                    NombreRancho = l.Rancho.NombreRancho,
                    Comunidad = l.Rancho.Ubicacion,
                    TotalAnimales = l.Animales.Count
                })
                .ToListAsync();
        }

        // POST: Crear lote
        [HttpPost]
        public async Task<ActionResult<LoteResponseDto>> CreateLote([FromBody] CreateLoteDto loteDto)
        {
            var rancho = await _context.Ranchos.FindAsync(loteDto.Id_Rancho);
            if (rancho == null) return BadRequest("Rancho no existe");

            var lote = new Lote
            {
                Id_Rancho = loteDto.Id_Rancho,
            
                Remo = loteDto.Remo,
                Fecha_Entrada = loteDto.Fecha_Entrada,
                Estado = "Disponible",
                Fecha_Creacion = DateTime.Now
            };

            await _context.Lotes.AddAsync(lote);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLote), new { id = lote.Id_Lote }, new LoteResponseDto
            {
                Id_Lote = lote.Id_Lote,
                NombreRancho = rancho.NombreRancho,
                Comunidad = rancho.Ubicacion,
                Remo = lote.Remo,
                FechaEntrada = lote.Fecha_Entrada,
                Estado = lote.Estado,
                TotalAnimales = 0,
                FechaCreacion = lote.Fecha_Creacion
            });
        }

        // PUT: Actualizar lote
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLote(int id, [FromBody] UpdateLoteDto updateDto)
        {
            var lote = await _context.Lotes.FindAsync(id);
            if (lote == null) return NotFound();

           
            lote.Estado = updateDto.Estado ?? lote.Estado;

            _context.Entry(lote).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: Eliminar lote
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLote(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.Animales)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);

            if (lote == null) return NotFound();
            if (lote.Animales.Any()) return BadRequest("No se puede eliminar un lote con animales");

            _context.Lotes.Remove(lote);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTOs
    public class CreateLoteDto
    {
        public int Id_Rancho { get; set; }
        public string Comunidad { get; set; }
        public int Remo { get; set; }
        public DateTime Fecha_Entrada { get; set; } = DateTime.Now;
        public DateTime? Fecha_Salida { get; set; }
        public string Upp { get; set; }
        public string Estado { get; set; } = "Disponible";
    }

    public class UpdateLoteDto
    {
        public string? Comunidad { get; set; }
        public string? Estado { get; set; }
    }

    public class LoteResponseDto
    {
        public int Id_Lote { get; set; }
        public string NombreRancho { get; set; }
        public string Comunidad { get; set; }
        public string Estado { get; set; }
        public int Remo { get; set; }
        public int TotalAnimales { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaEntrada { get; set; }
    }
}