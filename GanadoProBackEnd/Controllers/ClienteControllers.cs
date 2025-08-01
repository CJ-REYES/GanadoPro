using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using System;
using Microsoft.AspNetCore.Authorization;
using GanadoProBackEnd.Services;

namespace GanadoProBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClientesController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IActividadService _actividadService;

        public ClientesController(MyDbContext context, IActividadService actividadService)
        {
            _context = context;
            _actividadService = actividadService;
        }

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
                    Upp = c.Upp,
                    Rol = c.Rol
                })
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ClienteResponseDTO>> PostCliente([FromBody] ClienteCreateDTO clienteDTO)
        {
            if (clienteDTO == null)
            {
                return BadRequest("El cuerpo de la solicitud no puede estar vacío");
            }

            var usuario = await _context.Users.FindAsync(clienteDTO.Id_User);
            if (usuario == null)
            {
                return BadRequest($"El usuario con ID {clienteDTO.Id_User} no existe");
            }

            var validRoles = new[] { "Cliente", "Productor" };
            if (string.IsNullOrWhiteSpace(clienteDTO.Rol) || !validRoles.Contains(clienteDTO.Rol))
            {
                return BadRequest("El Rol debe ser 'Cliente' o 'Productor'");
            }

            var cliente = new Clientes
            {
                Id_User = clienteDTO.Id_User,
                Name = clienteDTO.Name?.Trim(),
                Propietario = clienteDTO.Propietario?.Trim() ?? string.Empty,
                Domicilio = clienteDTO.Domicilio?.Trim() ?? string.Empty,
                Localidad = clienteDTO.Localidad?.Trim() ?? string.Empty,
                Municipio = clienteDTO.Municipio?.Trim() ?? string.Empty,
                Entidad = clienteDTO.Entidad?.Trim() ?? string.Empty,
                Upp = clienteDTO.Upp?.Trim() ?? string.Empty,
                Rol = clienteDTO.Rol.Trim()
            };

            var validationContext = new ValidationContext(cliente);
            var validationResults = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
            if (!Validator.TryValidateObject(cliente, validationContext, validationResults, true))
            {
                return BadRequest(validationResults);
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                await _actividadService.RegistrarActividadAsync(
                    tipo: "Registro",
                    descripcion: $"Nuevo cliente creado: {clienteDTO.Name}",
                    estado: "Completado",
                    entidadId: cliente.Id_Cliente,
                    tipoEntidad: "Cliente"
                );

                var clienteResponse = new ClienteResponseDTO
                {
                    Id_Cliente = cliente.Id_Cliente,
                    Id_User = cliente.Id_User,
                    Name = cliente.Name,
                    Propietario = cliente.Propietario,
                    Domicilio = cliente.Domicilio,
                    Localidad = cliente.Localidad,
                    Municipio = cliente.Municipio,
                    Entidad = cliente.Entidad,
                    Upp = cliente.Upp,
                    Rol = cliente.Rol
                };

                return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id_Cliente }, clienteResponse);
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();

                if (dbEx.InnerException is MySqlException mySqlEx)
                {
                    switch (mySqlEx.Number)
                    {
                        case 1452:
                            return BadRequest("Error de relación: " + mySqlEx.Message);
                        case 1062:
                            return Conflict("Registro duplicado: " + mySqlEx.Message);
                        default:
                            return StatusCode(500, $"Error de base de datos (Código: {mySqlEx.Number}): {mySqlEx.Message}");
                    }
                }

                return StatusCode(500, $"Error al guardar: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }

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
                Upp = cliente.Upp,
                Rol = cliente.Rol
            };
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, [FromBody] ClienteUpdateDTO clienteDTO)
        {
            if (clienteDTO == null)
            {
                return BadRequest("El cuerpo de la solicitud no puede estar vacío");
            }

            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            if (clienteDTO.Rol != null && clienteDTO.Rol != "Cliente" && clienteDTO.Rol != "Productor")
            {
                return BadRequest("El rol debe ser 'Cliente' o 'Productor'");
            }

            cliente.Name = clienteDTO.Name ?? cliente.Name;
            cliente.Propietario = clienteDTO.Propietario ?? cliente.Propietario;
            cliente.Domicilio = clienteDTO.Domicilio ?? cliente.Domicilio;
            cliente.Localidad = clienteDTO.Localidad ?? cliente.Localidad;
            cliente.Municipio = clienteDTO.Municipio ?? cliente.Municipio;
            cliente.Entidad = clienteDTO.Entidad ?? cliente.Entidad;
            cliente.Upp = clienteDTO.Upp ?? cliente.Upp;
            cliente.Rol = clienteDTO.Rol ?? cliente.Rol;

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                
                await _actividadService.RegistrarActividadAsync(
                    tipo: "Actualización",
                    descripcion: $"Cliente actualizado: {clienteDTO.Name ?? cliente.Name}",
                    estado: "Completado",
                    entidadId: id,
                    tipoEntidad: "Cliente"
                );
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
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null) return NotFound();

            bool hasRelations = await _context.Animales.AnyAsync(a => a.Id_Cliente == id)
                            || await _context.Lotes.AnyAsync(l => l.Id_Cliente == id)
                            || await _context.Ventas.AnyAsync(v => v.Id_Cliente == id);

            if (hasRelations)
            {
                return BadRequest(new
                {
                    message = "No se puede eliminar por registros relacionados",
                    relaciones = new
                    {
                        animales = await _context.Animales.CountAsync(a => a.Id_Cliente == id),
                        lotes = await _context.Lotes.CountAsync(l => l.Id_Cliente == id),
                        ventas = await _context.Ventas.CountAsync(v => v.Id_Cliente == id)
                    }
                });
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Eliminación",
                descripcion: $"Cliente eliminado: ID {id}",
                estado: "Completado",
                entidadId: id,
                tipoEntidad: "Cliente"
            );

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.Id_Cliente == id);
        }

        public class ClienteCreateDTO
        {
            public int Id_User { get; set; }
            public string Rol { get; set; }
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
            public string Rol { get; set; }
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
            public string Rol { get; set; }
        }
    }
}