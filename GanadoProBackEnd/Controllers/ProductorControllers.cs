using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GanadoProBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoresController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ProductoresController(MyDbContext context)
        {
            _context = context;
        }

        // DTOs dentro del controlador (como clases internas)
        public class ProductorCreateDTO
        {
            public int Id_User { get; set; }
            public string Name { get; set; }
            public string Propietario { get; set; }
            public string Domicilio { get; set; }
            public string Localidad { get; set; }
            public string Municipio { get; set; }
            public string Entidad { get; set; }
            public string Upp { get; set; }
        }

        public class ProductorUpdateDTO
        {
            public string Name { get; set; }
            public string Propietario { get; set; }
            public string Domicilio { get; set; }
            public string Localidad { get; set; }
            public string Municipio { get; set; }
            public string Entidad { get; set; }
            public string Upp { get; set; }
        }

        public class ProductorResponseDTO
        {
            public int Id_Productor { get; set; }
            public int Id_User { get; set; }
            public string Name { get; set; }
            public string Propietario { get; set; }
            public string Domicilio { get; set; }
            public string Localidad { get; set; }
            public string Municipio { get; set; }
            public string Entidad { get; set; }
            public string Upp { get; set; }
        }

        // GET: api/Productores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductorResponseDTO>>> GetProductores()
        {
            return await _context.Productores
                .Select(p => new ProductorResponseDTO
                {
                    Id_Productor = p.Id_Productor,
                    Id_User = p.Id_User,
                    Name = p.Name,
                    Propietario = p.Propietario,
                    Domicilio = p.Domicilio,
                    Localidad = p.Localidad,
                    Municipio = p.Municipio,
                    Entidad = p.Entidad,
                    Upp = p.Upp
                })
                .ToListAsync();
        }

        // GET: api/Productores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductorResponseDTO>> GetProductor(int id)
        {
            var productor = await _context.Productores.FindAsync(id);

            if (productor == null)
            {
                return NotFound(new { message = $"Productor con ID {id} no encontrado" });
            }

            return new ProductorResponseDTO
            {
                Id_Productor = productor.Id_Productor,
                Id_User = productor.Id_User,
                Name = productor.Name,
                Propietario = productor.Propietario,
                Domicilio = productor.Domicilio,
                Localidad = productor.Localidad,
                Municipio = productor.Municipio,
                Entidad = productor.Entidad,
                Upp = productor.Upp
            };
        }

        // POST: api/Productores
        [HttpPost]
        public async Task<ActionResult<ProductorResponseDTO>> PostProductor(ProductorCreateDTO productorDTO)
        {
            // Validar que el usuario existe
            if (!await _context.Users.AnyAsync(u => u.Id_User == productorDTO.Id_User))
            {
                return BadRequest(new { message = "El usuario especificado no existe" });
            }

            var productor = new Productores
            {
                Id_User = productorDTO.Id_User,
                Name = productorDTO.Name,
                Propietario = productorDTO.Propietario,
                Domicilio = productorDTO.Domicilio,
                Localidad = productorDTO.Localidad,
                Municipio = productorDTO.Municipio,
                Entidad = productorDTO.Entidad,
                Upp = productorDTO.Upp
            };

            _context.Productores.Add(productor);
            await _context.SaveChangesAsync();

            var responseDTO = new ProductorResponseDTO
            {
                Id_Productor = productor.Id_Productor,
                Id_User = productor.Id_User,
                Name = productor.Name,
                Propietario = productor.Propietario,
                Domicilio = productor.Domicilio,
                Localidad = productor.Localidad,
                Municipio = productor.Municipio,
                Entidad = productor.Entidad,
                Upp = productor.Upp
            };

            return CreatedAtAction("GetProductor", new { id = productor.Id_Productor }, responseDTO);
        }

        // PUT: api/Productores/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductor(int id, ProductorUpdateDTO productorDTO)
        {
            var productor = await _context.Productores.FindAsync(id);
            if (productor == null)
            {
                return NotFound(new { message = $"Productor con ID {id} no encontrado" });
            }

            // Actualizar solo los campos permitidos
            productor.Name = productorDTO.Name;
            productor.Propietario = productorDTO.Propietario;
            productor.Domicilio = productorDTO.Domicilio;
            productor.Localidad = productorDTO.Localidad;
            productor.Municipio = productorDTO.Municipio;
            productor.Entidad = productorDTO.Entidad;
            productor.Upp = productorDTO.Upp;

            _context.Entry(productor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductorExists(id))
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

        // DELETE: api/Productores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductor(int id)
        {
            var productor = await _context.Productores
                .Include(p => p.Animales)
                .Include(p => p.Ventas)
                .FirstOrDefaultAsync(p => p.Id_Productor == id);

            if (productor == null)
            {
                return NotFound(new { message = $"Productor con ID {id} no encontrado" });
            }

            // Verificar relaciones existentes
            if (productor.Animales.Any() || productor.Ventas.Any())
            {
                return BadRequest(new 
                {
                    message = "No se puede eliminar el productor porque tiene registros relacionados",
                    detalles = new 
                    {
                        animales = productor.Animales.Count,
                        ventas = productor.Ventas.Count
                    }
                });
            }

            _context.Productores.Remove(productor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductorExists(int id)
        {
            return _context.Productores.Any(e => e.Id_Productor == id);
        }
    }
}