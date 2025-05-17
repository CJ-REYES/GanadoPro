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

        // GET: api/Lotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoteResponseDto>>> GetLotes()
        {
            return await _context.Lotes
                .Include(l => l.corrales)
                    .ThenInclude(c => c.Rancho)
                .Include(l => l.Animales)
                .Select(l => new LoteResponseDto
                {
                    Id_Lote = l.Id_Lote,
                    Id_Corral = l.Id_Corrales,
                    NombreCorral = l.corrales.NombreCorral,
                    NombreRancho = l.corrales.Rancho.NombreRancho,
                    Remo = l.Remo,
                    Fecha_Entrada = l.Fecha_Entrada,
                    Fecha_Salida = l.Fecha_Salida,
                    Upp = l.Upp,
                    Comunidad = l.Comunidad,
                    TotalAnimales = l.Animales.Count,
                    Animales = l.Animales.Select(a => new AnimalResponseDto
                    {
                        Id_Animal = a.Id_Animal,
                        Arete = a.Arete,
                        Peso = a.Peso,
                        Sexo = a.Sexo,
                        Clasificacion = a.Clasificacion,
                        Categoria = a.Categoria,
                        Raza = a.Raza,
                        Edad_Meses = a.Edad_Meses,
                        Fecha_Registro = a.Fecha_Registro,
                        Id_Lote = a.Id_Lote
                    }).ToList()
                })
                .ToListAsync();
        }
        // GET: api/Lotes/para-venta
        [HttpGet("para-venta")]
        public async Task<ActionResult<IEnumerable<LoteResponseDto>>> GetLotesParaVenta()
        {
            return await _context.Lotes
                .Where(l => l.Estado == "Disponible")
                .Include(l => l.corrales)
                .Select(l => new LoteResponseDto
                {
                    Id_Lote = l.Id_Lote,
                    NombreCorral = l.corrales.NombreCorral,
                    Fecha_Entrada = l.Fecha_Entrada,
                    TotalAnimales = l.Animales.Count,
                    Estado = l.Estado
                })
                .ToListAsync();
        }

        // PATCH: api/Lotes/5/marcar-venta
        [HttpPatch("{id}/marcar-venta")]
        public async Task<IActionResult> MarcarParaVenta(int id, [FromBody] EstadoLoteDto estadoDto)
        {
            var lote = await _context.Lotes.FindAsync(id);
            if (lote == null) return NotFound();

            lote.Estado = estadoDto.Estado;
            lote.ObservacionesVenta = estadoDto.Observaciones;

            _context.Entry(lote).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Lotes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LoteResponseDto>> GetLote(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.corrales)
                    .ThenInclude(c => c.Rancho)
                .Include(l => l.Animales)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);

            if (lote == null) return NotFound();

            return new LoteResponseDto
            {
                Id_Lote = lote.Id_Lote,
                Id_Corral = lote.Id_Corrales,
                NombreCorral = lote.corrales.NombreCorral,
                NombreRancho = lote.corrales.Rancho.NombreRancho,
                Remo = lote.Remo,
                Fecha_Entrada = lote.Fecha_Entrada,
                Fecha_Salida = lote.Fecha_Salida,
                Upp = lote.Upp,
                Comunidad = lote.Comunidad,
                TotalAnimales = lote.Animales.Count,
                Animales = lote.Animales.Select(a => new AnimalResponseDto
                {
                    Id_Animal = a.Id_Animal,
                    Arete = a.Arete,
                    Peso = a.Peso,
                    Sexo = a.Sexo,
                    Clasificacion = a.Clasificacion,
                    Categoria = a.Categoria,
                    Raza = a.Raza,
                    Edad_Meses = a.Edad_Meses,
                    Fecha_Registro = a.Fecha_Registro,
                    Id_Lote = a.Id_Lote
                }).ToList()
            };
        }

        // POST: api/Lotes
        [HttpPost]
        public async Task<ActionResult<LoteResponseDto>> CreateLote([FromBody] CreateLoteDto loteDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var corral = await _context.Corrales
                .Include(c => c.Rancho)
                .FirstOrDefaultAsync(c => c.Id_Corrales == loteDto.Id_Corral);

            if (corral == null) return BadRequest("Corral no encontrado");

            var lote = new Lote
            {
                Id_Corrales = loteDto.Id_Corral,
                Remo = loteDto.Remo,
                Fecha_Entrada = loteDto.Fecha_Entrada,
                Fecha_Salida = loteDto.Fecha_Salida,
                Upp = loteDto.Upp,
                Comunidad = loteDto.Comunidad
            };

            await _context.Lotes.AddAsync(lote);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLote), new { id = lote.Id_Lote }, new LoteResponseDto
            {
                Id_Lote = lote.Id_Lote,
                Id_Corral = lote.Id_Corrales,
                NombreCorral = corral.NombreCorral,
                NombreRancho = corral.Rancho.NombreRancho,
                Remo = lote.Remo,
                Fecha_Entrada = lote.Fecha_Entrada,
                Fecha_Salida = lote.Fecha_Salida,
                Upp = lote.Upp,
                Comunidad = lote.Comunidad,
                TotalAnimales = 0
            });
        }

        // PUT: api/Lotes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLote(int id, [FromBody] UpdateLoteDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var lote = await _context.Lotes.FindAsync(id);
            if (lote == null) return NotFound();

            // Actualizar solo propiedades permitidas
            lote.Remo = updateDto.Remo ?? lote.Remo;
            lote.Fecha_Entrada = updateDto.Fecha_Entrada ?? lote.Fecha_Entrada;
            lote.Fecha_Salida = updateDto.Fecha_Salida ?? lote.Fecha_Salida;
            lote.Upp = updateDto.Upp ?? lote.Upp;
            lote.Comunidad = updateDto.Comunidad ?? lote.Comunidad;

            _context.Entry(lote).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Lotes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLote(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.Animales)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);

            if (lote == null) return NotFound();
            if (lote.Animales.Any()) return BadRequest("No se puede eliminar un lote con animales asociados");

            _context.Lotes.Remove(lote);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // ======= DTOs Actualizados =======
    public class LoteResponseDto
    {
        public int Id_Lote { get; set; }
        public int Id_Corral { get; set; }
        public string NombreCorral { get; set; }
        public string NombreRancho { get; set; }
        public int Remo { get; set; }
        public DateTime Fecha_Entrada { get; set; }
        public DateTime Fecha_Salida { get; set; }
        public string Upp { get; set; }
        public string Comunidad { get; set; }
        public string Estado { get; set; }
        public string ObservacionesVenta { get; set; }
        public int TotalAnimales { get; set; }
        public List<AnimalResponseDto> Animales { get; set; }
    }

    public class CreateLoteDto
    {
        [Required]
        public int Id_Corral { get; set; }

        [Required]
        public int Remo { get; set; }

        [Required]
        public DateTime Fecha_Entrada { get; set; }
        public DateTime Fecha_Salida { get; set; }

        [StringLength(50)]
        public string Upp { get; set; }

        [StringLength(100)]
        public string Comunidad { get; set; }
    }

    public class UpdateLoteDto
    {
        public int? Remo { get; set; }
        public DateTime? Fecha_Entrada { get; set; }
        public DateTime? Fecha_Salida { get; set; }
        public string Upp { get; set; }
        public string Comunidad { get; set; }
    }
    
    public class EstadoLoteDto
    {
        [Required]
        public string Estado { get; set; } // Ej: Disponible, Reservado, Vendido
        public string Observaciones { get; set; }
    }
}