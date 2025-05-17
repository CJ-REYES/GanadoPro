using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;
using System.ComponentModel.DataAnnotations;

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RanchosController : ControllerBase
    {
        private readonly MyDbContext _context;

        public RanchosController(MyDbContext context) => _context = context;

        // GET: api/Ranchos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RanchoResponseDto>>> GetRanchos()
        {
            return await _context.Ranchos
                .Include(r => r.User)
                .Include(r => r.Corrales)
                    .ThenInclude(c => c.Lotes)
                .Select(r => new RanchoResponseDto
                {
                    Id_Rancho = r.Id_Rancho,
                    NombreRancho = r.NombreRancho,
                    Ubicacion = r.Ubicacion,
                    Propietario = r.Propietario,
                    Telefono = r.Telefono,
                    CorreoElectronico = r.CorreoElectronico,
                    TipoGanado = r.TipoGanado,
                    CapacidadMaxima = r.CapacidadMaxima,
                    Id_User = r.Id_User,
                    TotalCorrales = r.Corrales.Count,
                    TotalLotes = r.Corrales.Sum(c => c.Lotes.Count),
                    Corrales = r.Corrales.Select(c => new CorralInfoDto
                    {
                        Id_Corral = c.Id_Corrales,
                        NombreCorral = c.NombreCorral,
                        Estado = c.Estado,
                        TotalLotes = c.Lotes.Count
                    }).ToList()
                })
                .ToListAsync();
        }

        // GET: api/Ranchos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RanchoResponseDto>> GetRancho(int id)
        {
            var rancho = await _context.Ranchos
                .Include(r => r.User)
                .Include(r => r.Corrales)
                    .ThenInclude(c => c.Lotes)
                .FirstOrDefaultAsync(r => r.Id_Rancho == id);

            if (rancho == null) return NotFound();

            return new RanchoResponseDto
            {
                Id_Rancho = rancho.Id_Rancho,
                NombreRancho = rancho.NombreRancho,
                Ubicacion = rancho.Ubicacion,
                Propietario = rancho.Propietario,
                Telefono = rancho.Telefono,
                CorreoElectronico = rancho.CorreoElectronico,
                TipoGanado = rancho.TipoGanado,
                CapacidadMaxima = rancho.CapacidadMaxima,
                Id_User = rancho.Id_User,
                TotalCorrales = rancho.Corrales.Count,
                TotalLotes = rancho.Corrales.Sum(c => c.Lotes.Count),
                Corrales = rancho.Corrales.Select(c => new CorralInfoDto
                {
                    Id_Corral = c.Id_Corrales,
                    NombreCorral = c.NombreCorral,
                    Estado = c.Estado,
                    TotalLotes = c.Lotes.Count
                }).ToList()
            };
        }

        // GET: api/Ranchos/5/corrales
        [HttpGet("{id}/corrales")]
        public async Task<ActionResult<IEnumerable<CorralInfoDto>>> GetCorralesPorRancho(int id)
        {
            var rancho = await _context.Ranchos
                .Include(r => r.Corrales)
                .FirstOrDefaultAsync(r => r.Id_Rancho == id);

            if (rancho == null) return NotFound();

            return rancho.Corrales.Select(c => new CorralInfoDto
            {
                Id_Corral = c.Id_Corrales,
                NombreCorral = c.NombreCorral,
                Estado = c.Estado,
                TotalLotes = c.Lotes.Count
            }).ToList();
        }

        // POST: api/Ranchos
        [HttpPost]
        public async Task<ActionResult<RanchoResponseDto>> CreateRancho([FromBody] CreateRanchoDto ranchoDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _context.Users.FindAsync(ranchoDto.Id_User);
            if (user == null) return BadRequest("Usuario no encontrado");

            var rancho = new Rancho
            {
                Id_User = ranchoDto.Id_User,
                NombreRancho = ranchoDto.NombreRancho,
                Ubicacion = ranchoDto.Ubicacion,
                Propietario = ranchoDto.Propietario,
                Telefono = ranchoDto.Telefono,
                CorreoElectronico = ranchoDto.CorreoElectronico,
                TipoGanado = ranchoDto.TipoGanado,
                CapacidadMaxima = ranchoDto.CapacidadMaxima
            };

            await _context.Ranchos.AddAsync(rancho);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRancho), new { id = rancho.Id_Rancho }, new RanchoResponseDto
            {
                Id_Rancho = rancho.Id_Rancho,
                NombreRancho = rancho.NombreRancho,
                Ubicacion = rancho.Ubicacion,
                Propietario = rancho.Propietario,
                Telefono = rancho.Telefono,
                CorreoElectronico = rancho.CorreoElectronico,
                TipoGanado = rancho.TipoGanado,
                CapacidadMaxima = rancho.CapacidadMaxima,
                Id_User = rancho.Id_User,
                TotalCorrales = 0,
                TotalLotes = 0
            });
        }

        // PUT: api/Ranchos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRancho(int id, [FromBody] UpdateRanchoDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var rancho = await _context.Ranchos.FindAsync(id);
            if (rancho == null) return NotFound();

            rancho.NombreRancho = updateDto.NombreRancho ?? rancho.NombreRancho;
            rancho.Ubicacion = updateDto.Ubicacion ?? rancho.Ubicacion;
            rancho.Propietario = updateDto.Propietario ?? rancho.Propietario;
            rancho.Telefono = updateDto.Telefono ?? rancho.Telefono;
            rancho.CorreoElectronico = updateDto.CorreoElectronico ?? rancho.CorreoElectronico;
            rancho.TipoGanado = updateDto.TipoGanado ?? rancho.TipoGanado;
            rancho.CapacidadMaxima = updateDto.CapacidadMaxima ?? rancho.CapacidadMaxima;

            _context.Entry(rancho).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Ranchos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRancho(int id)
        {
            var rancho = await _context.Ranchos
                .Include(r => r.Corrales)
                .FirstOrDefaultAsync(r => r.Id_Rancho == id);

            if (rancho == null) return NotFound();
            if (rancho.Corrales.Any()) return BadRequest("No se puede eliminar un rancho con corrales asociados");

            _context.Ranchos.Remove(rancho);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // ======= DTOs =======
    public class RanchoResponseDto
    {
        public int Id_Rancho { get; set; }
        public string NombreRancho { get; set; }
        public string Ubicacion { get; set; }
        public string Propietario { get; set; }
        public string Telefono { get; set; }
        public string CorreoElectronico { get; set; }
        public string TipoGanado { get; set; }
        public int CapacidadMaxima { get; set; }
        public int Id_User { get; set; }
        public int TotalCorrales { get; set; }
        public int TotalLotes { get; set; }
        public List<CorralInfoDto> Corrales { get; set; }
    }

    public class CorralInfoDto
    {
        public int Id_Corral { get; set; }
        public string NombreCorral { get; set; }
        public string Estado { get; set; }
        public int TotalLotes { get; set; }
    }

    public class CreateRanchoDto
    {
        [Required]
        public int Id_User { get; set; }

        [Required]
        [StringLength(50)]
        public string NombreRancho { get; set; }

        [StringLength(100)]
        public string Ubicacion { get; set; }

        [StringLength(50)]
        public string Propietario { get; set; }

        [StringLength(20)]
        public string Telefono { get; set; }

        [EmailAddress]
        public string CorreoElectronico { get; set; }

        [StringLength(50)]
        public string TipoGanado { get; set; }

        [Range(1, 100000)]
        public int CapacidadMaxima { get; set; }
    }

    public class UpdateRanchoDto
    {
        public string? NombreRancho { get; set; }
        public string? Ubicacion { get; set; }
        public string? Propietario { get; set; }
        public string? Telefono { get; set; }
        public string? CorreoElectronico { get; set; }
        public string? TipoGanado { get; set; }
        public int? CapacidadMaxima { get; set; }
    }
}