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
    public class OrdenVentaController : ControllerBase
    {
        private readonly MyDbContext _context;

        public OrdenVentaController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/OrdenVenta
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrdenVenta>>> GetAll()
        {
            return await _context.OrdenesVenta.ToListAsync();
        }

        // GET: api/OrdenVenta/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrdenVenta>> GetById(int id)
        {
            var orden = await _context.OrdenesVenta.FindAsync(id);

            if (orden == null)
            {
                return NotFound();
            }

            return orden;
        }

        // POST: api/OrdenVenta
        [HttpPost]
        public async Task<ActionResult<OrdenVenta>> Create([FromBody] OrdenVenta nuevaOrden)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.OrdenesVenta.Add(nuevaOrden);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = nuevaOrden.Id }, nuevaOrden);
        }

        // PUT: api/OrdenVenta/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrdenVenta ordenActualizada)
        {
            if (id != ordenActualizada.Id)
            {
                return BadRequest();
            }

            _context.Entry(ordenActualizada).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrdenVentaExists(id))
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

        // DELETE: api/OrdenVenta/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var orden = await _context.OrdenesVenta.FindAsync(id);
            if (orden == null)
            {
                return NotFound();
            }

            _context.OrdenesVenta.Remove(orden);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrdenVentaExists(int id)
        {
            return _context.OrdenesVenta.Any(o => o.Id == id);
        }
    }
}
