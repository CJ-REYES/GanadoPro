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

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RanchosController : ControllerBase
    {
        private readonly MyDbContext _context;

        public RanchosController(MyDbContext context)
        {
            _context = context;
        }

        // GET: Todos los ranchos
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

        // GET: Rancho por ID
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

        // POST: Crear nuevo rancho
        [HttpPost]
 
        public async Task<ActionResult<RanchoResponseDto>> CreateRancho([FromBody] CreateRanchoDto ranchoDto)
        {
            // Verificar que el usuario exista
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

            // Recargar la entidad con las relaciones
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

        // PUT: Actualizar rancho
        [HttpPut("{id}")]
    
        public async Task<IActionResult> UpdateRancho(int id, [FromBody] UpdateRanchoDto updateDto)
        {
            var rancho = await _context.Ranchos
                .FirstOrDefaultAsync(r => r.Id_Rancho == id);

            if (rancho == null)
            {
                return NotFound();
            }

            // Actualizar propiedades
            if (!string.IsNullOrWhiteSpace(updateDto.NombreRancho))
            {
                rancho.NombreRancho = updateDto.NombreRancho;
            }

            if (!string.IsNullOrWhiteSpace(updateDto.Ubicacion))
            {
                rancho.Ubicacion = updateDto.Ubicacion;
            }

            // Si se proporciona un nuevo Id_User, transferir la propiedad
            if (updateDto.Id_User.HasValue)
            {
                // Verificar que el nuevo usuario exista
                var newUserExists = await _context.Users.AnyAsync(u => u.Id_User == updateDto.Id_User.Value);
                if (!newUserExists)
                {
                    return BadRequest("El nuevo usuario propietario no existe");
                }
                rancho.Id_User = updateDto.Id_User.Value;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: Eliminar rancho
        [HttpDelete("{id}")]
    
        public async Task<IActionResult> DeleteRancho(int id)
        {
            var rancho = await _context.Ranchos
                .Include(r => r.Lotes)
                .FirstOrDefaultAsync(r => r.Id_Rancho == id);

            if (rancho == null)
            {
                return NotFound();
            }

            if (rancho.Lotes.Any())
            {
                return BadRequest("No se puede eliminar un rancho con lotes asociados");
            }

            _context.Ranchos.Remove(rancho);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTOs
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
}