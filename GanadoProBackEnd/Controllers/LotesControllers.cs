using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using GanadoProBackEnd.Data;

namespace GanadoProBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LotesController : ControllerBase
    {
        private readonly MyDbContext _context;

        public LotesController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Lotes
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Lote>>> GetLotes()
        {
            return await _context.Lotes
                .Include(l => l.Rancho)
                .Include(l => l.User)
                .Include(l => l.Cliente)
                .Include(l => l.Animales)
                .ToListAsync();
        }

        // GET: api/Lotes/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Lote>> GetLote(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.Rancho)
                .Include(l => l.User)
                .Include(l => l.Cliente)
                .Include(l => l.Animales)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);

            if (lote == null)
                return NotFound();

            return lote;
        }

        // POST: api/Lotes
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Lote>> CreateLote([FromBody] Lote lote)
        {
            // Validación extra
            var rancho = await _context.Ranchos.Include(r => r.User)
                                               .FirstOrDefaultAsync(r => r.Id_Rancho == lote.Id_Rancho);
            if (rancho == null)
                return BadRequest("El rancho no existe");

            lote.Estado = "Disponible";
            lote.Fecha_Creacion = DateTime.Now;
            lote.Id_User = rancho.Id_User; // Asegura asignación del propietario del rancho

            _context.Lotes.Add(lote);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLote), new { id = lote.Id_Lote }, lote);
        }

        // PUT: api/Lotes/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateLote(int id, Lote updatedLote)
        {
            if (id != updatedLote.Id_Lote)
                return BadRequest("ID no coincide");

            var existingLote = await _context.Lotes.FindAsync(id);
            if (existingLote == null)
                return NotFound();

            existingLote.Remo = updatedLote.Remo;
            existingLote.Fecha_Entrada = updatedLote.Fecha_Entrada;
            existingLote.Fecha_Salida = updatedLote.Fecha_Salida;
            existingLote.Observaciones = updatedLote.Observaciones;
            existingLote.Estado = updatedLote.Estado;

            _context.Entry(existingLote).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Lotes/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteLote(int id)
        {
            var lote = await _context.Lotes.FindAsync(id);
            if (lote == null)
                return NotFound();

            _context.Lotes.Remove(lote);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
