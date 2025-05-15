using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;

using System.ComponentModel.DataAnnotations;
// Ensure that RanchoResponseDto is defined in GanadoProBackEnd.DTOs namespace.
// If not, create the RanchoResponseDto class in the DTOs folder as shown below.

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
                .Include(r => r.Lote)
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
                    TotalLotes = r.Lote.Count,
                    Lotes = r.Lote.Select(l => new LoteInfoDto
                    {
                        Id_Lote = l.Id_Lote,
                        Nombre = l.NombreRancho,
                        FechaEntrada = l.Fecha_Entrada
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
                .Include(r => r.Lote)
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
                TotalLotes = rancho.Lote.Count,
                Lotes = rancho.Lote.Select(l => new LoteInfoDto
                {
                    Id_Lote = l.Id_Lote,
                    Nombre = l.NombreRancho,
                    FechaEntrada = l.Fecha_Entrada
                }).ToList()
            };
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
                .Include(r => r.Lote)
                .FirstOrDefaultAsync(r => r.Id_Rancho == id);

            if (rancho == null) return NotFound();
            if (rancho.Lote.Any()) return BadRequest("No se puede eliminar un rancho con lotes asociados");

            _context.Ranchos.Remove(rancho);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
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
        public int TotalLotes { get; set; }
        public List<LoteInfoDto> Lotes { get; set; }
    }

    public class LoteInfoDto
    {
        public int Id_Lote { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaEntrada { get; set; }
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
    
