using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;


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
        public async Task<ActionResult<IEnumerable<GanadoProBackEnd.DTOs.LoteResponseDto>>> GetLotes()
        {
            return await _context.Lotes
                .Include(l => l.Rancho)
                .Include(l => l.Animales)
                .Select(l => new GanadoProBackEnd.DTOs.LoteResponseDto
                {
                    Id_Lote = l.Id_Lote,
                    Id_Rancho = l.Id_Rancho,
                    NombreRancho = l.NombreRancho,
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

        // GET: api/Lotes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GanadoProBackEnd.DTOs.LoteResponseDto>> GetLote(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.Rancho)
                .Include(l => l.Animales)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);

            if (lote == null) return NotFound();

            return new GanadoProBackEnd.DTOs.LoteResponseDto
            {
                Id_Lote = lote.Id_Lote,
                Id_Rancho = lote.Id_Rancho,
                NombreRancho = lote.NombreRancho,
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
    Categoria = a.Categoria,      // Ahora está incluido
    Raza = a.Raza,
    Edad_Meses = a.Edad_Meses,     // Ahora está incluido
    Fecha_Registro = a.Fecha_Registro, // Ahora está incluido
    Id_Lote = a.Id_Lote
}).ToList()
            };
        }

        // POST: api/Lotes
        [HttpPost]
        public async Task<ActionResult<GanadoProBackEnd.DTOs.LoteResponseDto>> CreateLote([FromBody] GanadoProBackEnd.DTOs.CreateLoteDto loteDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var rancho = await _context.Ranchos.FindAsync(loteDto.Id_Rancho);
            if (rancho == null) return BadRequest("Rancho no encontrado");

            var lote = new Lote
            {
                Id_Rancho = loteDto.Id_Rancho,
                NombreRancho = rancho.NombreRancho,
                Remo = loteDto.Remo,
                Fecha_Entrada = loteDto.Fecha_Entrada,
                Fecha_Salida = loteDto.Fecha_Salida,
                Upp = loteDto.Upp,
                Comunidad = loteDto.Comunidad
            };

            await _context.Lotes.AddAsync(lote);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLote), new { id = lote.Id_Lote }, new GanadoProBackEnd.DTOs.LoteResponseDto
            {
                Id_Lote = lote.Id_Lote,
                Id_Rancho = lote.Id_Rancho,
                NombreRancho = lote.NombreRancho,
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
        public async Task<IActionResult> UpdateLote(int id, [FromBody] GanadoProBackEnd.DTOs.UpdateLoteDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var lote = await _context.Lotes.FindAsync(id);
            if (lote == null) return NotFound();

            lote.NombreRancho = updateDto.NombreRancho ?? lote.NombreRancho;
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
}