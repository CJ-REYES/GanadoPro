using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VentasController : ControllerBase
    {
        private readonly MyDbContext _context;

        public VentasController(MyDbContext context) => _context = context;

        // Método estático reutilizable para actualizar estado de venta
public static async Task ActualizarEstadoVenta(MyDbContext context, Venta venta)
{
    if (venta.Estado == "Programada" && venta.FechaSalida <= DateTime.Today)
    {
        venta.Estado = "Completada";
        foreach (var lote in venta.LotesVendidos)
        {
            lote.Estado = "Vendido";
            foreach (var animal in lote.Animales)
            {
                animal.Estado = "Vendido"; // Solo aquí -> Vendido
            }
        }
        await context.SaveChangesAsync();
    }
}

        // GET: api/Ventas (todas las ventas programadas o disponibles)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VentaResponseDto>>> GetVentas()
        {
            // Actualizar estado de ventas antes de mostrar
            await ActualizarVentasPendientes();
            
            var ventas = await _context.Ventas
                .Include(v => v.Cliente)
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Rancho)
                .Where(v => v.Estado == "Programada" || v.Estado == "Disponible")
                .OrderByDescending(v => v.FechaSalida)
                .ToListAsync();

            return ventas.Select(v => MapToDto(v)).ToList();
        }

        // Actualiza todas las ventas pendientes que cumplan con la fecha
        private async Task ActualizarVentasPendientes()
        {
            var ventasPendientes = await _context.Ventas
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Animales)
                .Where(v => v.Estado == "Programada" && v.FechaSalida <= DateTime.Today)
                .ToListAsync();

            foreach (var venta in ventasPendientes)
            {
                await ActualizarEstadoVenta(_context, venta);
            }
        }

        // GET: api/Ventas/LotesVendidos
        [HttpGet("LotesVendidos")]
        public async Task<ActionResult<IEnumerable<LoteVendidoDto>>> GetLotesVendidos()
        {
            var lotesVendidos = await _context.Lotes
                .Include(l => l.Rancho)
                .Include(l => l.Cliente)
                .Where(l => l.Estado == "Vendido")
                .OrderByDescending(l => l.Fecha_Salida)
                .ToListAsync();

            return lotesVendidos.Select(l => new LoteVendidoDto
            {
                Id_Lote = l.Id_Lote,
                Nombre = l.Remo.ToString(),
                REMO = l.Remo,
                Comunidad = l.Rancho?.Ubicacion ?? "",
                UPP_Cliente = l.Cliente?.Upp ?? "",
                Nombre_Cliente = l.Cliente?.Name ?? "",
                Fecha_Venta = l.Fecha_Salida ?? DateTime.MinValue,
                Estado = l.Estado
            }).ToList();
        }

        // POST: api/Ventas
        [HttpPost]
        public async Task<ActionResult<VentaResponseDto>> ProgramarVenta([FromBody] CreateVentaDto ventaDto)
        {
            // Obtener ID de usuario autenticado
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            
            // Validar cliente por ID
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Id_Cliente == ventaDto.Id_Cliente);
            if (cliente == null)
                return BadRequest("El cliente no existe");

            // Validar que la UPP pertenece a un cliente
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

            // Actualizar lotes y animales
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
                    animal.UppDestino = cliente.Upp; // AÑADIR ESTA LÍNEA
                }
            }

            var venta = new Venta
            {
                FechaSalida = ventaDto.FechaSalida,
                Id_Rancho = ventaDto.Id_Rancho,
                Id_Cliente = cliente.Id_Cliente,
                Id_User = userId,
                UPP = cliente.Upp,
                FolioGuiaRemo = ventaDto.FolioGuiaRemo,
                TipoVenta = ventaDto.TipoVenta,
                Estado = "Programada",
                LotesVendidos = lotes
            };

            _context.Ventas.Add(venta);
            await _context.SaveChangesAsync();

            // Verificar si la fecha es pasada y actualizar estado
            await ActualizarEstadoVenta(_context, venta);

            var ventaConRelaciones = await _context.Ventas
                .Include(v => v.Cliente)
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Rancho)
                .FirstOrDefaultAsync(v => v.Id_Venta == venta.Id_Venta);

            return CreatedAtAction(nameof(GetVenta), new { id = venta.Id_Venta }, MapToDto(ventaConRelaciones));
        }

        // PUT: api/Ventas/5
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

            var fechaOriginal = venta.FechaSalida;
            var folioOriginal = venta.FolioGuiaRemo;
            
            // Actualizar propiedades
            venta.FechaSalida = ventaDto.FechaSalida;
            venta.FolioGuiaRemo = ventaDto.FolioGuiaRemo;
            if (ventaDto.TipoVenta.HasValue)
                venta.TipoVenta = ventaDto.TipoVenta.Value;
            else
                return BadRequest("El tipo de venta es requerido.");

            // Si cambió el folio guía remo, actualizar lotes y animales
            if (folioOriginal != ventaDto.FolioGuiaRemo)
            {
                // Intentar convertir el nuevo folio a entero para el lote
                if (!int.TryParse(ventaDto.FolioGuiaRemo, out int nuevoRemo))
                {
                    return BadRequest("El folio guía remo debe ser un número entero.");
                }

                foreach (var lote in venta.LotesVendidos)
                {
                    lote.Remo = nuevoRemo;

                    foreach (var animal in lote.Animales)
                    {
                        animal.FoliGuiaRemoSalida = ventaDto.FolioGuiaRemo;
                    }
                }
            }

            // Actualizar animales con nueva fecha y folio
            foreach (var lote in venta.LotesVendidos)
            {
                lote.Fecha_Salida = ventaDto.FechaSalida;
                
                foreach (var animal in lote.Animales)
                {
                    animal.FechaSalida = ventaDto.FechaSalida;
                    animal.FoliGuiaRemoSalida = ventaDto.FolioGuiaRemo;
                }
            }

            _context.Entry(venta).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            // Si la fecha cambió a una pasada, actualizar estado
            if (fechaOriginal != ventaDto.FechaSalida && ventaDto.FechaSalida <= DateTime.Today)
            {
                await ActualizarEstadoVenta(_context, venta);
            }

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
                    animal.Estado = "EnStock"; // Cambiar estado a EnStock
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

            // Actualizar estado si es necesario
            if (venta != null && venta.Estado == "Programada" && venta.FechaSalida <= DateTime.Today)
            {
                await ActualizarEstadoVenta(_context, venta);
                venta = await _context.Ventas
                    .Include(v => v.Cliente)
                    .Include(v => v.LotesVendidos)
                        .ThenInclude(l => l.Rancho)
                    .FirstOrDefaultAsync(v => v.Id_Venta == id);
            }

            return venta == null ? NotFound() : Ok(MapToDto(venta));
        }

        // GET: api/Ventas/AnimalesVendidos
        [HttpGet("AnimalesVendidos")]
        public async Task<ActionResult<IEnumerable<AnimalVendidoDto>>> GetAnimalesVendidos()
        {
            var animales = await _context.Animales
                .Include(a => a.Lote)
                    .ThenInclude(l => l.Rancho)
                .Include(a => a.Lote)
                    .ThenInclude(l => l.Cliente)
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
                NombreLote = a.Lote != null ? a.Lote.Remo.ToString() : "",
                Comunidad = a.Lote?.Rancho?.Ubicacion ?? "",
                UPP_Cliente = a.Lote?.Cliente?.Upp ?? ""
            }).ToList();

            return Ok(animalesVendidos);
        }

        // GET: api/Ventas/VentasCompletadas
        [HttpGet("VentasCompletadas")]
        public async Task<ActionResult<IEnumerable<VentaCompletadaDto>>> GetVentasCompletadas()
        {
            await ActualizarVentasPendientes();
            
            var ventasCompletadas = await _context.Ventas
                .Include(v => v.Cliente)
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Rancho)
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Animales)
                .Where(v => v.Estado == "Completada")
                .OrderByDescending(v => v.FechaSalida)
                .ToListAsync();

            return ventasCompletadas.Select(v => new VentaCompletadaDto
            {
                Id_Venta = v.Id_Venta,
                FechaSalida = v.FechaSalida ?? DateTime.MinValue,
                FolioGuiaRemo = v.FolioGuiaRemo ?? "",
                // Convertir tipo de venta a texto
                TipoVenta = v.TipoVenta == TipoVenta.Internacional ? "Internacional" : "Nacional",
                Estado = v.Estado,
                Cliente = v.Cliente?.Name ?? "",
                UPP = v.UPP ?? "",
                Lotes = v.LotesVendidos?.Select(l => new LoteVendidoInfoDto
                {
                    Id_Lote = l.Id_Lote,
                    REMO = l.Remo,
                    Comunidad = l.Rancho?.Ubicacion ?? "",
                    CantidadAnimales = l.Animales?.Count ?? 0,
                    Estado = l.Estado,
                    // Cargar animales directamente para evitar llamada adicional
                    Animales = l.Animales?.Select(a => new AnimalVendidoDto
                    {
                        Id_Animal = a.Id_Animal,
                        Arete = a.Arete,
                        Peso = a.Peso,
                        Sexo = a.Sexo,
                        Raza = a.Raza,
                        FechaSalida = a.FechaSalida
                    }).ToList() ?? new List<AnimalVendidoDto>()
                }).ToList() ?? new List<LoteVendidoInfoDto>()
            }).ToList();
        }

        // Agregar nuevo endpoint para lotes disponibles
        [HttpGet("lotes-disponibles")]
        public async Task<ActionResult<IEnumerable<LoteDisponibleDto>>> GetLotesDisponibles()
        {
            var lotes = await _context.Lotes
                .Include(l => l.Rancho)
                .Where(l => l.Estado == "Disponible")
                .Select(l => new LoteDisponibleDto
                {
                    Id_Lote = l.Id_Lote,
                    REMO = l.Remo,
                    Comunidad = l.Rancho.Ubicacion,
                    CantidadAnimales = l.Animales.Count
                })
                .ToListAsync();

            return Ok(lotes);
        }

[HttpGet("Lotes/{id}/Animales")]
public async Task<ActionResult<IEnumerable<AnimalVendidoDto>>> GetAnimalesPorLote(int id)
{
    // Eliminar filtro por estado
    var animales = await _context.Animales
        .Where(a => a.Id_Lote == id) // <- Solo filtrar por ID de lote
        .ToListAsync();

    return animales.Select(a => new AnimalVendidoDto
    {
        Id_Animal = a.Id_Animal,
        Arete = a.Arete,
        Peso = a.Peso,
        Sexo = a.Sexo,
        Raza = a.Raza,
        FechaSalida = a.FechaSalida
    }).ToList();
}

[HttpDelete("Completadas/{id}")]
public async Task<IActionResult> DeleteVentaCompletada(int id)
{
    var venta = await _context.Ventas
        .Include(v => v.LotesVendidos)
            .ThenInclude(l => l.Animales)
        .FirstOrDefaultAsync(v => v.Id_Venta == id);

    if (venta == null)
        return NotFound();

    if (venta.Estado != "Completada")
        return BadRequest("Solo se pueden eliminar ventas en estado 'Completada'");

    // Restaurar estado de lotes y animales
    foreach (var lote in venta.LotesVendidos.ToList())
    {
        lote.Estado = "Disponible";
        lote.Fecha_Salida = null;
        lote.Id_Cliente = null;
        
        foreach (var animal in lote.Animales)
        {
            animal.Estado = "EnStock";
            animal.FechaSalida = null;
            animal.FoliGuiaRemoSalida = null;
            animal.Id_Cliente = null;
        }
    }
    

    // Eliminar relación con lotes sin borrar la venta
            venta.LotesVendidos.Clear();
    
    // Cambiar estado de la venta a "Cancelada" en lugar de borrarla
    venta.Estado = "Cancelada";
    
    await _context.SaveChangesAsync();

    return NoContent();
}

        private static VentaResponseDto MapToDto(Venta venta)
        {
            return new VentaResponseDto
            {
                Id_Venta = venta.Id_Venta,
                FechaSalida = venta.FechaSalida ?? DateTime.MinValue,
                FolioGuiaRemo = venta.FolioGuiaRemo ?? "",
                Estado = venta.Estado,
                TipoVenta = venta.TipoVenta,
                Cliente = venta.Cliente?.Name ?? "",
                UPP = venta.UPP ?? "",
                Lotes = venta.LotesVendidos?.Select(l => new LoteInfoDto
                {
                    Id_Lote = l.Id_Lote,
                    REMO = l.Remo,
                    Comunidad = l.Rancho?.Ubicacion ?? "",
                    Estado = l.Estado
                }).ToList() ?? new List<LoteInfoDto>()
            };
        }
// En el método que devuelve la lista simple de clientes
[HttpGet("clientes-lista-simple")]
public async Task<ActionResult<IEnumerable<ClienteSimpleDto>>> GetClientesListaSimple()
{
 
    
            return await _context.Clientes
               .Where(c => 
                         (c.Rol == "Cliente" || c.Rol == "Cliente/Comprador"))
               .Select(c => new ClienteSimpleDto
               {
                   Id_Cliente = c.Id_Cliente,
                   Name = c.Name,
                   Upp = c.Upp,
                   
               })
               .ToListAsync();
}

// Añadir nuevo DTO
public class ClienteSimpleDto
{
    public int Id_Cliente { get; set; }
    public string Name { get; set; } = "";
    public string Upp { get; set; } = ""; // NUEVO CAMPO
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
    }

    // public enum TipoVenta
    // {
    //     Nacional,
    //     Internacional
    // }

    public class CreateVentaDto
    {
        [Required]
        public DateTime FechaSalida { get; set; }
        
        [Required]
        public string FolioGuiaRemo { get; set; } = "";
        
        [Required]
        public GanadoProBackEnd.Models.TipoVenta TipoVenta { get; set; }
        
        [Required]
        public List<int> LotesIds { get; set; } = new List<int>();
        
        [Required]
        public int Id_Cliente { get; set; }

        [Required]
        public int Id_Rancho { get; set; }

    }

    public class UpdateVentaDto
    {
        [Required]
        public DateTime FechaSalida { get; set; }
        
        [Required]
        public string FolioGuiaRemo { get; set; } = "";
        
        [Required]
        public TipoVenta? TipoVenta { get; set; }
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
        public string Estado { get; set; } = "";
    }

    public class LoteVendidoDto
    {
        public int Id_Lote { get; set; }
        public string Nombre { get; set; } = "";
        public int REMO { get; set; }
        public string Comunidad { get; set; } = "";
        public string UPP_Cliente { get; set; } = "";
        public string Nombre_Cliente { get; set; } = "";
        public DateTime Fecha_Venta { get; set; }
        public string Estado { get; set; } = "";
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

    public class VentaCompletadaDto
    {
        public int Id_Venta { get; set; }
        public DateTime FechaSalida { get; set; }
        public string FolioGuiaRemo { get; set; } = "";
        public string TipoVenta { get; set; } = "";
        public string Estado { get; set; } = "";
        public string Cliente { get; set; } = "";
        public string UPP { get; set; } = "";
        public List<LoteVendidoInfoDto> Lotes { get; set; } = new List<LoteVendidoInfoDto>();
    }

    public class LoteVendidoInfoDto
    {
        public int Id_Lote { get; set; }
        public int REMO { get; set; }
        public string Comunidad { get; set; } = "";
        public int CantidadAnimales { get; set; }
        public string Estado { get; set; } = "";
        public List<AnimalVendidoDto> Animales { get; set; } = new List<AnimalVendidoDto>();
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public string? ErrorMessage { get; set; }

        public static ValidationResult Valid() => new ValidationResult { IsValid = true };
        public static ValidationResult Invalid(string error) =>
            new ValidationResult { IsValid = false, ErrorMessage = error };
    }

    // DTO para lotes disponibles
    public class LoteDisponibleDto
    {
        public int Id_Lote { get; set; }
        public int REMO { get; set; }
        public string Comunidad { get; set; } = "";
        public int CantidadAnimales { get; set; }
    }
}