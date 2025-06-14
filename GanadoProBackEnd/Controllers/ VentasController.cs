using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;
using System.Linq;

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
            if (!await _context.Clientes.AnyAsync(c => c.Id_Cliente == ventaDto.Id_Cliente))
                return BadRequest("El cliente no existe");

            

            if (!await _context.Ranchos.AnyAsync(r => r.Id_Rancho == ventaDto.Id_Rancho))
                return BadRequest("El rancho no existe");

            var lotes = await _context.Lotes
                .Include(l => l.Animales)
                .Where(l => ventaDto.LotesIds.Contains(l.Id_Lote))
                .ToListAsync();

            if (lotes.Count != ventaDto.LotesIds.Count)
                return BadRequest("Algunos lotes no existen");

            var validationResult = ValidarAnimalesParaVenta(lotes, ventaDto.TipoVenta);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.ErrorMessage);

            foreach (var lote in lotes)
            {
                foreach (var animal in lote.Animales)
                {
                    animal.FechaSalida = ventaDto.FechaSalida;
                    animal.FoliGuiaRemoSalida = ventaDto.FolioGuiaRemo;
                }
            }

            var venta = new Venta
            {
                FechaSalida = ventaDto.FechaSalida,
                Id_Rancho = ventaDto.Id_Rancho,
                Id_Cliente = ventaDto.Id_Cliente,
                Id_Productor = ventaDto.Id_Productor,
                FolioGuiaRemo = ventaDto.FolioGuiaRemo,
                TipoVenta = ventaDto.TipoVenta,
                Estado = "Programada",
                LotesVendidos = lotes
            };

            _context.Ventas.Add(venta);
            await _context.SaveChangesAsync();

            var ventaConRelaciones = await _context.Ventas
                .Include(v => v.Cliente)
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Rancho)
                .FirstOrDefaultAsync(v => v.Id_Venta == venta.Id_Venta);

            return CreatedAtAction(nameof(GetVenta), new { id = venta.Id_Venta }, MapToDto(ventaConRelaciones));
        }

        // GET: api/Ventas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VentaResponseDto>> GetVenta(int id)
        {
            var venta = await _context.Ventas
                .Include(v => v.Cliente)
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Rancho)
                .FirstOrDefaultAsync(v => v.Id_Venta == id);

            return venta == null ? NotFound() : Ok(MapToDto(venta));
        }

        // GET: api/Ventas/AnimalesVendidos
        [HttpGet("AnimalesVendidos")]
        public async Task<ActionResult<IEnumerable<AnimalVendidoDto>>> GetAnimalesVendidos()
        {
            var animales = await _context.Animales
                .Include(a => a.Lote)
                .ThenInclude(l => l.Rancho)
                .Where(a => a.Estado == "Vendido")
                .ToListAsync();

            var animalesVendidos = animales.Select(a => new AnimalVendidoDto
            {
                Id_Animal = a.Id_Animal,
                Arete = a.Arete,
                Peso = a.Peso,
                Sexo = a.Sexo,
                Raza = a.Raza,
                FechaIngreso = a.FechaIngreso,
                FechaSalida = a.FechaSalida,
                Estado = a.Estado,
                Id_Lote = a.Lote?.Id_Lote,
                Comunidad = a.Lote?.Rancho?.Ubicacion ?? ""
            }).ToList();

            return Ok(animalesVendidos);
        }

        private static VentaResponseDto MapToDto(Venta? venta)
        {
            if (venta == null) return new VentaResponseDto();

            return new VentaResponseDto
            {
                Id_Venta = venta.Id_Venta,
                FechaSalida = venta.FechaSalida,
                FolioGuiaRemo = venta.FolioGuiaRemo,
                Estado = venta.Estado,
                TipoVenta = venta.TipoVenta,
                Cliente = venta.Cliente?.Name ?? "",
                Lotes = venta.LotesVendidos.Select(l => new LoteInfoDto
                {
                    Id_Lote = l.Id_Lote,
                    Comunidad = l.Rancho?.Ubicacion ?? ""
                }).ToList()
            };
        }

        private ValidationResult ValidarAnimalesParaVenta(List<Lote> lotes, TipoVenta tipoVenta)
        {
            var animales = lotes.SelectMany(l => l.Animales).ToList();

            if (tipoVenta == TipoVenta.Internacional)
            {
                var animalesInvalidos = animales
                    .Where(a => string.IsNullOrEmpty(a.ContanciaGarrapaticida) ||
                                string.IsNullOrEmpty(a.ValidacionConside_ID))
                    .ToList();

                if (animalesInvalidos.Any())
                {
                    var aretes = string.Join(", ", animalesInvalidos.Select(a => a.Arete));
                    return ValidationResult.Invalid(
                        $"Los siguientes animales no cumplen con los requisitos para venta internacional: {aretes}. " +
                        "Requieren Constancia Garrapaticida y Validación Conside ID.");
                }
            }

            return ValidationResult.Valid();
        }

        // POST: api/Ventas/ActualizarEstado/5
        [HttpPost("ActualizarEstado/{idVenta}")]
        public async Task<IActionResult> ActualizarEstadoAnimalesVendidos(int idVenta)
        {
            var venta = await _context.Ventas
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Animales)
                .FirstOrDefaultAsync(v => v.Id_Venta == idVenta);

            if (venta == null)
                return NotFound("La venta no existe.");

            if (venta.FechaSalida.Date <= DateTime.Today && venta.Estado == "Programada")
            {
                foreach (var lote in venta.LotesVendidos)
                {
                    lote.Estado = "Vendido";
                    lote.Fecha_Salida = venta.FechaSalida;

                    foreach (var animal in lote.Animales)
                    {
                        animal.Estado = "Vendido";
                        animal.FechaSalida = venta.FechaSalida;
                        animal.FoliGuiaRemoSalida = venta.FolioGuiaRemo;
                    }
                }

                venta.Estado = "Completada";
                await _context.SaveChangesAsync();

                return Ok("Estado actualizado correctamente.");
            }

            return BadRequest("No se puede actualizar el estado. Verifica la fecha o estado actual.");
        }
    }

    public class CreateVentaDto
    {
        [Required]
        public DateTime FechaSalida { get; set; }
        [Required]
        public int Id_Rancho { get; set; }
        [Required]
        public int Id_Cliente { get; set; }
        [Required]
        public int Id_Productor { get; set; }
        public string? FolioGuiaRemo { get; set; }
        [Required]
        public TipoVenta TipoVenta { get; set; }
        [Required]
        public List<int> LotesIds { get; set; } = new List<int>();
    }

    public class VentaResponseDto
    {
        public int Id_Venta { get; set; }
        public DateTime FechaSalida { get; set; }
        public string? FolioGuiaRemo { get; set; }
        public string Estado { get; set; } = "";
        public string Cliente { get; set; } = "";
        public TipoVenta TipoVenta { get; set; }
        public List<LoteInfoDto> Lotes { get; set; } = new List<LoteInfoDto>();
    }

    public class LoteInfoDto
    {
        public int Id_Lote { get; set; }
        public string Nombre { get; set; } = "";
        public string Comunidad { get; set; } = "";
    }

    public class AnimalVendidoDto
    {
        public int Id_Animal { get; set; }
        public string Arete { get; set; } = "";
        public int Peso { get; set; }
        public string Sexo { get; set; } = "";
        public string Raza { get; set; } = "";
        public DateTime? FechaIngreso { get; set; }
        public DateTime? FechaSalida { get; set; }
        public string Estado { get; set; } = "";
        public int? Id_Lote { get; set; }
        public string NombreLote { get; set; } = "";
        public string Comunidad { get; set; } = "";
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public string? ErrorMessage { get; set; }

        public static ValidationResult Valid() => new ValidationResult { IsValid = true };
        public static ValidationResult Invalid(string error) =>
            new ValidationResult { IsValid = false, ErrorMessage = error };
    }
}
