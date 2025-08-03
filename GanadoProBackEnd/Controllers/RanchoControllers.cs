using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using GanadoProBackEnd.Services;
using System.Transactions;

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RanchosController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IActividadService _actividadService;

        public RanchosController(MyDbContext context, IActividadService actividadService)
        {
            _context = context;
            _actividadService = actividadService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RanchoResponseDto>>> GetRanchos()
        {
            return await _context.Ranchos
                .Select(r => new RanchoResponseDto
                {
                    Id_Rancho = r.Id_Rancho,
                    Id_User = r.Id_User,
                    NombreRancho = r.NombreRancho,
                    Ubicacion = r.Ubicacion,
                    Propietario = r.User.Name,
                    Telefono = r.User.Telefono,
                    Email = r.User.Email,
                    TotalLotes = r.Lotes.Count
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RanchoResponseDto>> GetRancho(int id)
        {
            var rancho = await _context.Ranchos
                .Where(r => r.Id_Rancho == id)
                .Select(r => new RanchoResponseDto
                {
                    Id_Rancho = r.Id_Rancho,
                    Id_User = r.Id_User,
                    NombreRancho = r.NombreRancho,
                    Ubicacion = r.Ubicacion,
                    Propietario = r.User.Name,
                    Telefono = r.User.Telefono,
                    Email = r.User.Email,
                    TotalLotes = r.Lotes.Count
                })
                .FirstOrDefaultAsync();

            return rancho != null ? rancho : NotFound();
        }

        [HttpGet("mis-ranchos")]
        public async Task<ActionResult<IEnumerable<RanchoResponseDto>>> GetRanchosByUser()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var ranchos = await _context.Ranchos
                .Where(r => r.Id_User == userId)
                .Select(r => new RanchoResponseDto
                {
                    Id_Rancho = r.Id_Rancho,
                    Id_User = r.Id_User,
                    NombreRancho = r.NombreRancho,
                    Ubicacion = r.Ubicacion,
                    Propietario = r.User.Name,
                    Telefono = r.User.Telefono,
                    Email = r.User.Email,
                    TotalLotes = r.Lotes.Count
                })
                .ToListAsync();

            return ranchos;
        }

        [HttpPost]
        public async Task<ActionResult<RanchoResponseDto>> CreateRancho([FromBody] CreateRanchoDto ranchoDto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id_User == ranchoDto.Id_User);
            if (!userExists)
            {
                return BadRequest("El usuario especificado no existe en la base de datos");
            }

            var rancho = new Rancho
            {
                NombreRancho = ranchoDto.NombreRancho,
                Ubicacion = ranchoDto.Ubicacion,
                Id_User = ranchoDto.Id_User
            };

            _context.Ranchos.Add(rancho);
            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Registro",
                descripcion: $"Nuevo rancho creado: {ranchoDto.NombreRancho}",
                estado: "Completado",
                entidadId: rancho.Id_Rancho,
                tipoEntidad: "Rancho"
            );

            var createdRancho = await _context.Ranchos
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id_Rancho == rancho.Id_Rancho);

            if (createdRancho == null)
            {
                return NotFound();
            }

            return new RanchoResponseDto
            {
                Id_Rancho = createdRancho.Id_Rancho,
                Id_User = createdRancho.Id_User,
                NombreRancho = createdRancho.NombreRancho,
                Ubicacion = createdRancho.Ubicacion,
                Propietario = createdRancho.User?.Name,
                Telefono = createdRancho.User?.Telefono,
                Email = createdRancho.User?.Email,
                TotalLotes = 0
            };
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRancho(int id, [FromBody] UpdateRanchoDto updateDto)
        {
            var rancho = await _context.Ranchos
                .FirstOrDefaultAsync(r => r.Id_Rancho == id);

            if (rancho == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(updateDto.NombreRancho))
            {
                rancho.NombreRancho = updateDto.NombreRancho;
            }

            if (!string.IsNullOrWhiteSpace(updateDto.Ubicacion))
            {
                rancho.Ubicacion = updateDto.Ubicacion;
            }

            if (updateDto.Id_User.HasValue)
            {
                var newUserExists = await _context.Users.AnyAsync(u => u.Id_User == updateDto.Id_User.Value);
                if (!newUserExists)
                {
                    return BadRequest("El nuevo usuario propietario no existe");
                }
                rancho.Id_User = updateDto.Id_User.Value;
            }

            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Actualización",
                descripcion: $"Rancho actualizado: {updateDto.NombreRancho ?? rancho.NombreRancho}",
                estado: "Completado",
                entidadId: id,
                tipoEntidad: "Rancho"
            );

            return NoContent();
        }

[HttpDelete("{id}")]
public async Task<IActionResult> DeleteRancho(int id, [FromQuery] int? ranchoDestinoId)
{
    try
    {
        var rancho = await _context.Ranchos
            .Include(r => r.Lotes)
            .Include(r => r.Animales)
            .FirstOrDefaultAsync(r => r.Id_Rancho == id);

        if (rancho == null)
        {
            return NotFound("Rancho no encontrado");
        }

        // Verificar si tiene dependencias
        bool tieneDependencias = rancho.Lotes.Any() || rancho.Animales.Any();
        
        if (tieneDependencias)
        {
            // Validar rancho destino
            if (!ranchoDestinoId.HasValue)
            {
                return BadRequest("El rancho tiene registros asociados. Proporcione el ID de un rancho destino para transferirlos.");
            }

            if (ranchoDestinoId.Value == id)
            {
                return BadRequest("No puede transferir los registros al mismo rancho que se va a eliminar.");
            }

            var ranchoDestino = await _context.Ranchos.FindAsync(ranchoDestinoId.Value);
            if (ranchoDestino == null)
            {
                return BadRequest("El rancho destino especificado no existe.");
            }

            // Transferir lotes
            foreach (var lote in rancho.Lotes)
            {
                lote.Id_Rancho = ranchoDestinoId.Value;
            }

            // Transferir animales
            foreach (var animal in rancho.Animales)
            {
                animal.Id_Rancho = ranchoDestinoId.Value;
            }
            
            await _context.SaveChangesAsync();
        }

        // Eliminar el rancho
        _context.Ranchos.Remove(rancho);
        await _context.SaveChangesAsync();
        
        await _actividadService.RegistrarActividadAsync(
            tipo: "Eliminación",
            descripcion: $"Rancho eliminado: ID {id}" + 
                         (tieneDependencias ? $". Registros transferidos a rancho ID {ranchoDestinoId}" : ""),
            estado: "Completado",
            entidadId: id,
            tipoEntidad: "Rancho"
        );

        return NoContent();
    }
    catch (Exception ex)
    {
        return StatusCode(500, new {
            error = "Error interno al procesar la solicitud",
            detail = ex.Message
        });
    }
}
        
[HttpGet("{id}/animales")]
public async Task<ActionResult<IEnumerable<Animal>>> GetAnimalesPorRancho(int id)
{
    try
    {
        var animales = await _context.Animales
            .Where(a => a.Lote.Id_Rancho == id)
            .ToListAsync();
            
        return Ok(animales);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Error interno del servidor: {ex.Message}");
    }
}
        [HttpGet("resumen-ganado")]
        public async Task<ActionResult<IEnumerable<ResumenGanadoDto>>> GetResumenGanadoPorRancho()
        {
            var resumen = await _context.Ranchos
                .Select(r => new ResumenGanadoDto
                {
                    Id_Rancho = r.Id_Rancho,
                    NombreRancho = r.NombreRancho,
                    TotalAnimales = r.Animales.Count(),
                    TotalHembras = r.Animales.Count(a => a.Sexo == "Hembra"),
                    TotalMachos = r.Animales.Count(a => a.Sexo == "Macho")
                })
                .ToListAsync();

            return resumen;
        }
    }

    public class CreateRanchoDto
    {
        [Required(ErrorMessage = "El nombre del rancho es obligatorio")]
        [StringLength(50, ErrorMessage = "El nombre del rancho no puede exceder los 50 caracteres")]
        public string NombreRancho { get; set; }

        public string Ubicacion { get; set; }

        [Required(ErrorMessage = "El ID de usuario es obligatorio")]
        public int Id_User { get; set; }
    }

    public class UpdateRanchoDto
    {
        [StringLength(50, ErrorMessage = "El nombre del rancho no puede exceder los 50 caracteres")]
        public string NombreRancho { get; set; }

        public string Ubicacion { get; set; }

        public int? Id_User { get; set; }
    }

    public class RanchoResponseDto
    {
        public int Id_Rancho { get; set; }
        public int Id_User { get; set; }
        public string NombreRancho { get; set; }
        public string Ubicacion { get; set; }
        public string Propietario { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public int TotalLotes { get; set; }
    }
    
    public class ResumenGanadoDto
    {
        public int Id_Rancho { get; set; }
        public string NombreRancho { get; set; }
        public int TotalAnimales { get; set; }
        public int TotalHembras { get; set; }
        public int TotalMachos { get; set; }
    }
}