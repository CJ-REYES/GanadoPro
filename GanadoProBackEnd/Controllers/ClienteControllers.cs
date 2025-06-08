using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.DTOs;
using GanadoProBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GanadoProBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ClientesController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteResponseDTO>>> GetClientes()
        {
            return await _context.Clientes
                .Select(c => new ClienteResponseDTO
                {
                    Id_Cliente = c.Id_Cliente,
                    Id_User = c.Id_User,
                    Name = c.Name,
                    Propietario = c.Propietario,
                    Domicilio = c.Domicilio,
                    Localidad = c.Localidad,
                    Municipio = c.Municipio,
                    Entidad = c.Entidad,
                    Upp = c.Upp
                })
                .ToListAsync();
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteResponseDTO>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return new ClienteResponseDTO
            {
                Id_Cliente = cliente.Id_Cliente,
                Id_User = cliente.Id_User,
                Name = cliente.Name,
                Propietario = cliente.Propietario,
                Domicilio = cliente.Domicilio,
                Localidad = cliente.Localidad,
                Municipio = cliente.Municipio,
                Entidad = cliente.Entidad,
                Upp = cliente.Upp
            };
        }

        // POST: api/Clientes
        [HttpPost]
        public async Task<ActionResult<ClienteResponseDTO>> PostCliente(ClienteCreateDTO clienteDTO)
        {
            // Validar que el usuario existe
            if (!await _context.Users.AnyAsync(u => u.Id_User == clienteDTO.Id_User))
            {
                return BadRequest("El usuario especificado no existe");
            }

            var cliente = new Clientes
            {
                Id_User = clienteDTO.Id_User,
                Name = clienteDTO.Name,
                Propietario = clienteDTO.Propietario,
                Domicilio = clienteDTO.Domicilio,
                Localidad = clienteDTO.Localidad,
                Municipio = clienteDTO.Municipio,
                Entidad = clienteDTO.Entidad,
                Upp = clienteDTO.Upp
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            var responseDTO = new ClienteResponseDTO
            {
                Id_Cliente = cliente.Id_Cliente,
                Id_User = cliente.Id_User,
                Name = cliente.Name,
                Propietario = cliente.Propietario,
                Domicilio = cliente.Domicilio,
                Localidad = cliente.Localidad,
                Municipio = cliente.Municipio,
                Entidad = cliente.Entidad,
                Upp = cliente.Upp
            };

            return CreatedAtAction("GetCliente", new { id = cliente.Id_Cliente }, responseDTO);
        }

        // PUT: api/Clientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, ClienteUpdateDTO clienteDTO)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            // Actualizar solo los campos permitidos
            cliente.Name = clienteDTO.Name;
            cliente.Propietario = clienteDTO.Propietario;
            cliente.Domicilio = clienteDTO.Domicilio;
            cliente.Localidad = clienteDTO.Localidad;
            cliente.Municipio = clienteDTO.Municipio;
            cliente.Entidad = clienteDTO.Entidad;
            cliente.Upp = clienteDTO.Upp;

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes
                .Include(c => c.Animales)
                .Include(c => c.Lotes)
                .Include(c => c.Ventas)
                .FirstOrDefaultAsync(c => c.Id_Cliente == id);

            if (cliente == null)
            {
                return NotFound();
            }

            // Verificar relaciones existentes
            if (cliente.Animales.Any() || cliente.Lotes.Any() || cliente.Ventas.Any())
            {
                return BadRequest(new
                {
                    message = "No se puede eliminar el cliente porque tiene registros relacionados",
                    detalles = new
                    {
                        animales = cliente.Animales.Count,
                        lotes = cliente.Lotes.Count,
                        ventas = cliente.Ventas.Count
                    }
                });
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.Id_Cliente == id);
        }

        // ClienteCreateDTO.cs (Para creación)

        public class ClienteCreateDTO
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
        public class ClienteUpdateDTO
        {
            public string Name { get; set; }
            public string Propietario { get; set; }
            public string Domicilio { get; set; }
            public string Localidad { get; set; }
            public string Municipio { get; set; }
            public string Entidad { get; set; }
            public string Upp { get; set; }
        }
        public class ClienteResponseDTO
        {
            public int Id_Cliente { get; set; }
            public int Id_User { get; set; }
            public string Name { get; set; }
            public string Propietario { get; set; }
            public string Domicilio { get; set; }
            public string Localidad { get; set; }
            public string Municipio { get; set; }
            public string Entidad { get; set; }
            public string Upp { get; set; }
        }
    
    }
}