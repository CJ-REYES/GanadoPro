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
    public class VentasController : ControllerBase
    {
        private readonly MyDbContext _context;

        public VentasController(MyDbContext context) => _context = context;

        // POST: api/Ventas
        [HttpPost]
        public async Task<ActionResult<VentaResponseDto>> ProgramarVenta([FromBody] CreateVentaDto ventaDto)
        {
            var lotes = await _context.Lotes
                .Where(l => ventaDto.LotesIds.Contains(l.Id_Lote))
                .ToListAsync();

            if (lotes.Count != ventaDto.LotesIds.Count)
                return BadRequest("Algunos lotes no existen");

            var venta = new Venta
            {
                FechaProgramada = ventaDto.FechaProgramada,
                Cliente = ventaDto.Cliente,
                Estado = "Programada",
                Lotes = lotes
            };

            await _context.Ventas.AddAsync(venta);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVenta), new { id = venta.Id_Venta }, new VentaResponseDto
    {
        Id_Venta = venta.Id_Venta,
        FechaProgramada = venta.FechaProgramada,
        Cliente = venta.Cliente,
        Estado = venta.Estado,
        Lotes = venta.Lotes.Select(l => new LoteInfoDto 
        { 
            Id_Lote = l.Id_Lote, 
            FechaEntrada = l.Fecha_Entrada 
        }).ToList()
    });
        }

        // GET: api/Ventas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VentaResponseDto>> GetVenta(int id)
        {
            var venta = await _context.Ventas
                .Include(v => v.Lotes)
                .FirstOrDefaultAsync(v => v.Id_Venta == id);

            return venta == null ? NotFound() : (ActionResult<VentaResponseDto>)new VentaResponseDto
            {
                Id_Venta = venta.Id_Venta,
                FechaProgramada = venta.FechaProgramada,
                Cliente = venta.Cliente,
                Estado = venta.Estado,
                Lotes = venta.Lotes.Select(l => new LoteInfoDto
                {
                    Id_Lote = l.Id_Lote,
                    FechaEntrada = l.Fecha_Entrada
                }).ToList()
            };
        }
    }

    
   
    public class CreateVentaDto
    {
        [Required]
        public DateTime FechaProgramada { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Cliente { get; set; }
        
        [Required]
        public List<int> LotesIds { get; set; }
    }

    public class VentaResponseDto
    {
        public int Id_Venta { get; set; }
        public DateTime FechaProgramada { get; set; }
        public string Cliente { get; set; }
        public string Estado { get; set; }
        public List<LoteInfoDto> Lotes { get; set; }
    }
}