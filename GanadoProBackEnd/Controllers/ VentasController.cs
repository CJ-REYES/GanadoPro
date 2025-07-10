using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VentasController : ControllerBase
    {
        private readonly MyDbContext _context;

        public VentasController(MyDbContext context) => _context = context;

        // GET: api/Ventas (Solo ventas en proceso o disponible)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VentaResponseDto>>> GetVentas()
        {
            var ventas = await _context.Ventas
                .Include(v => v.Cliente)
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Rancho)
                .Where(v => v.Estado == "Programada" || v.Estado == "Disponible")
                .OrderByDescending(v => v.FechaSalida)
                .ToListAsync();

            return ventas.Select(v => MapToDto(v)).ToList();
        }

        // POST: api/Ventas
        [HttpPost]
        public async Task<ActionResult<VentaResponseDto>> ProgramarVenta([FromBody] CreateVentaDto ventaDto)
        {
            // Obtener ID de usuario autenticado
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            
            // Validar cliente por UPP
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Upp == ventaDto.UPP);
            if (cliente == null)
                return BadRequest("El cliente no existe");

            // Validar que la UPP pertenece a un cliente (rol "Cliente")
            if (cliente.Rol != "Cliente")
                return BadRequest("La UPP proporcionada no pertenece a un cliente");

            // Validar rancho
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

            // Actualizar lotes y animales con fecha de salida y cliente
            foreach (var lote in lotes)
            {
                lote.Fecha_Salida = ventaDto.FechaSalida;
                lote.Estado = "En proceso de venta";
                lote.Id_Cliente = cliente.Id_Cliente;
                
                foreach (var animal in lote.Animales)
                {
                    animal.FechaSalida = ventaDto.FechaSalida;
                    animal.FoliGuiaRemoSalida = ventaDto.FolioGuiaRemo;
                    animal.Id_Cliente = cliente.Id_Cliente;
                    animal.Estado = "En proceso de venta";
                }
            }

            var venta = new Venta
            {
                FechaSalida = ventaDto.FechaSalida,
                Id_Rancho = ventaDto.Id_Rancho,
                Id_Cliente = cliente.Id_Cliente,
                Id_User = userId,
                UPP = ventaDto.UPP,
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

        // PUT: api/Ventas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVenta(int id, [FromBody] UpdateVentaDto ventaDto)
        {
            if (ventaDto == null)
                return BadRequest("El objeto de actualización es requerido");

            var venta = await _context.Ventas
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Animales)
                .FirstOrDefaultAsync(v => v.Id_Venta == id);

            if (venta == null)
                return NotFound();

            if (venta.Estado != "Programada")
                return BadRequest("Solo se pueden modificar ventas en estado 'Programada'");

            venta.FechaSalida = ventaDto.FechaSalida;
            venta.FolioGuiaRemo = ventaDto.FolioGuiaRemo;
            venta.TipoVenta = ventaDto.TipoVenta;

            foreach (var lote in venta.LotesVendidos)
            {
                if (lote.Animales != null)
                {
                    foreach (var animal in lote.Animales)
                    {
                        animal.FechaSalida = ventaDto.FechaSalida;
                        animal.FoliGuiaRemoSalida = ventaDto.FolioGuiaRemo;
                    }
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Ventas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVenta(int id)
        {
            var venta = await _context.Ventas
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Animales)
                .FirstOrDefaultAsync(v => v.Id_Venta == id);

            if (venta == null)
                return NotFound();

            if (venta.Estado != "Programada")
                return BadRequest("Solo se pueden eliminar ventas en estado 'Programada'");

            // Restaurar estado de lotes y animales
            foreach (var lote in venta.LotesVendidos)
            {
                lote.Estado = "Disponible";
                lote.Fecha_Salida = null;
                lote.Id_Cliente = null;
                
                foreach (var animal in lote.Animales)
                {
                    animal.Estado = "Disponible";
                    animal.FechaSalida = null;
                    animal.FoliGuiaRemoSalida = null;
                    animal.Id_Cliente = null;
                }
            }

            venta.LotesVendidos.Clear();
            _context.Ventas.Remove(venta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Ventas/5 (Venta específica por ID)
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

            // Obtener los IDs de cliente únicos
            var clienteIds = animales.Select(a => a.Id_Cliente).Where(id => id != null).Distinct().ToList();
            var clientes = await _context.Clientes
                .Where(c => clienteIds.Contains(c.Id_Cliente))
                .ToDictionaryAsync(c => c.Id_Cliente, c => c.Upp);

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
                NombreLote = a.Lote?.Remo.ToString() ?? "",
                Comunidad = a.Lote?.Rancho?.Ubicacion ?? "",
                UPP_Cliente = (a.Id_Cliente != null && clientes.ContainsKey(a.Id_Cliente.Value)) ? clientes[a.Id_Cliente.Value] : ""
            }).ToList();

            return Ok(animalesVendidos);
        }

        private static VentaResponseDto MapToDto(Venta venta)
        {
            return new VentaResponseDto
            {
                Id_Venta = venta.Id_Venta,
                FechaSalida = venta.FechaSalida ?? DateTime.MinValue,
                FolioGuiaRemo = venta.FolioGuiaRemo,
                Estado = venta.Estado,
                TipoVenta = venta.TipoVenta,
                Cliente = venta.Cliente?.Name ?? "",
                UPP = venta.UPP,
                Lotes = venta.LotesVendidos.Select(l => new LoteInfoDto
                {
                    Id_Lote = l.Id_Lote,
                    REMO = l.Remo,
                    Comunidad = l.Rancho?.Ubicacion ?? ""
                }).ToList()
            };
        }

        private ValidationResult ValidarAnimalesParaVenta(List<Lote> lotes, TipoVenta tipoVenta)
        {
            var animales = lotes.SelectMany(l => l.Animales).ToList();

            // Solo validar para venta internacional
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

            if (venta.FechaSalida != null && 
                venta.FechaSalida.Value.Date <= DateTime.Today && 
                venta.Estado == "Programada")
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
                        animal.Id_Cliente = venta.Id_Cliente;
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
        public string UPP { get; set; } = "";
        
        [Required]
        public string FolioGuiaRemo { get; set; } = "";
        
        [Required]
        public TipoVenta TipoVenta { get; set; }
        
        [Required]
        public List<int> LotesIds { get; set; } = new List<int>();
    }

    public class UpdateVentaDto
    {
        [Required]
        public DateTime FechaSalida { get; set; }
        
        [Required]
        public string FolioGuiaRemo { get; set; } = "";
        
        [Required]
        public TipoVenta TipoVenta { get; set; }
    }

    public class VentaResponseDto
    {
        public int Id_Venta { get; set; }
        public DateTime FechaSalida { get; set; }
        public string FolioGuiaRemo { get; set; } = "";
        public string Estado { get; set; } = "";
        public string Cliente { get; set; } = "";
        public string UPP { get; set; } = "";
        public TipoVenta TipoVenta { get; set; }
        public List<LoteInfoDto> Lotes { get; set; } = new List<LoteInfoDto>();
    }

    public class LoteInfoDto
    {
        public int Id_Lote { get; set; }
        public int REMO { get; set; }
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
        public string UPP_Cliente { get; set; } = "";
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