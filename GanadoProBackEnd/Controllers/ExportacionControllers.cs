using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace GanadoProBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExportacionController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ExportacionController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Exportacion
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exportacion>>> GetAll()
        {
            return await _context.Exportaciones.ToListAsync();
        }

        // GET: api/Exportacion/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Exportacion>> GetById(int id)
        {
            var exportacion = await _context.Exportaciones.FindAsync(id);

            if (exportacion == null)
            {
                return NotFound();
            }

            return exportacion;
        }

        // POST: api/Exportacion
        [HttpPost]
        public async Task<ActionResult<Exportacion>> Create([FromBody] Exportacion nuevaExportacion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Exportaciones.Add(nuevaExportacion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = nuevaExportacion.Id }, nuevaExportacion);
        }

        // PUT: api/Exportacion/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Exportacion exportacionActualizada)
        {
            if (id != exportacionActualizada.Id)
            {
                return BadRequest();
            }

            _context.Entry(exportacionActualizada).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExportacionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Exportacion/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var exportacion = await _context.Exportaciones.FindAsync(id);
            if (exportacion == null)
            {
                return NotFound();
            }

            _context.Exportaciones.Remove(exportacion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExportacionExists(int id)
        {
            return _context.Exportaciones.Any(e => e.Id == id);
        }
    }
}
