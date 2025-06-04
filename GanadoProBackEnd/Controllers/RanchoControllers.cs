using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RanchosController : ControllerBase
    {
        private readonly MyDbContext _context;

        public RanchosController(MyDbContext context) => _context = context;

        // GET: Todos los ranchos
[HttpGet]
[Authorize]

public async Task<ActionResult<IEnumerable<RanchoResponseDto>>> GetRanchos()
{

    // Get current user ID from token
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId)) 
        return Unauthorized();
        
    return await _context.Ranchos
        .Where(r => r.Id_User == int.Parse(userId)) // ADD THIS FILTER
        .Include(r => r.User)
        .Include(r => r.Lotes)
        .Select(r => new RanchoResponseDto
                {
                    Id_Rancho = r.Id_Rancho,
                    Id_User = r.Id_User, // Mapear directamente desde el rancho
                    NombreRancho = r.NombreRancho,
                    Ubicacion = r.Ubicacion,
                    Propietario = r.User.Name,
                    Telefono = r.User.Telefono,
                    Email = r.User.Email, // Ahora sí tendrá valor
                    TotalLotes = r.Lotes.Count
                })
                .ToListAsync();
}

        // GET: Rancho por ID
        [HttpGet("{id}")]
[Authorize]

public async Task<ActionResult<RanchoResponseDto>> GetRancho(int id)
{
    var rancho = await _context.Ranchos
        .Include(r => r.User) // ¡Agregar esta línea!
        .Include(r => r.Lotes)
        .FirstOrDefaultAsync(r => r.Id_Rancho == id);

    if (rancho == null) return NotFound();

    return new RanchoResponseDto
    {
        Id_Rancho = rancho.Id_Rancho,
        Id_User = rancho.Id_User, // Mapear desde el rancho
        NombreRancho = rancho.NombreRancho,
        Ubicacion = rancho.Ubicacion,
        Propietario = rancho.User.Name,
        Telefono = rancho.User.Telefono,
        Email = rancho.User.Email, // Ya no será null
        TotalLotes = rancho.Lotes.Count
    };
}

        // POST: Crear rancho
        [HttpPost]
[Authorize]

public async Task<ActionResult<RanchoResponseDto>> CreateRancho([FromBody] CreateRanchoDto ranchoDto)
{
    var user = await _context.Users.FindAsync(ranchoDto.Id_User);
    if (user == null) return BadRequest("Usuario no encontrado");

    var rancho = new Rancho
    {
        NombreRancho = ranchoDto.NombreRancho,
        Ubicacion = ranchoDto.Ubicacion,
        Id_User = ranchoDto.Id_User,
        User = user
    };

    await _context.Ranchos.AddAsync(rancho);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetRancho), new { id = rancho.Id_Rancho }, new RanchoResponseDto
    {
        Id_Rancho = rancho.Id_Rancho,
        Id_User = rancho.Id_User,
        NombreRancho = rancho.NombreRancho,
        Ubicacion = rancho.Ubicacion,
        Propietario = user.Name,
        Telefono = user.Telefono,
        Email = user.Email, // Usar el email del usuario
        TotalLotes = 0
    });
}

        // PUT: Actualizar rancho
        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> UpdateRancho(int id, [FromBody] UpdateRanchoDto updateDto)
        {
            var rancho = await _context.Ranchos.FindAsync(id);
            if (rancho == null) return NotFound();

            rancho.NombreRancho = updateDto.NombreRancho ?? rancho.NombreRancho;
            rancho.Ubicacion = updateDto.Ubicacion ?? rancho.Ubicacion;


            _context.Entry(rancho).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: Eliminar rancho
        [HttpDelete("{id}")]
        [Authorize]

        public async Task<IActionResult> DeleteRancho(int id)
        {
            var rancho = await _context.Ranchos
                .Include(r => r.Lotes)
                .FirstOrDefaultAsync(r => r.Id_Rancho == id);

            if (rancho == null) return NotFound();
            if (rancho.Lotes.Any()) return BadRequest("No se puede eliminar un rancho con lotes");

            _context.Ranchos.Remove(rancho);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTOs
    public class CreateRanchoDto
    {
        [Required] public string NombreRancho { get; set; }
        public string Ubicacion { get; set; }
        public int Id_User { get; set; }
    }

    public class UpdateRanchoDto
    {
        public string? NombreRancho { get; set; }
        public string? Ubicacion { get; set; }

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