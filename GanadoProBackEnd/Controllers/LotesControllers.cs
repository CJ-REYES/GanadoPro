using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using GanadoProBackEnd.Data;
using System.ComponentModel.DataAnnotations;
using GanadoProBackEnd.Services;

namespace GanadoProBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LotesController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IActividadService _actividadService;

        public LotesController(MyDbContext context, IActividadService actividadService)
        {
            _context = context;
            _actividadService = actividadService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoteResponseDto>>> GetLotes(
            [FromQuery] List<string> estados)
        {
            var query = _context.Lotes
                .Include(l => l.User)
                .Include(l => l.Cliente)
                .Include(l => l.Animales)
                .Include(l => l.Rancho)
                .AsQueryable();

            if (estados != null && estados.Count > 0)
            {
                query = query.Where(l => estados.Contains(l.Estado));
            }

            var lotes = await query.ToListAsync();
            return lotes.Select(l => MapLoteToDto(l)).ToList();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<LoteResponseDto>> GetLote(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.User)
                .Include(l => l.Cliente)
                .Include(l => l.Animales)
                .Include(l => l.Rancho)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);

            if (lote == null)
                return NotFound();

            var nuevoEstado = CalcularEstado(lote.Estado, lote.Fecha_Salida);
            if (nuevoEstado != lote.Estado)
            {
                lote.Estado = nuevoEstado;
                _context.Entry(lote).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            return MapLoteToDto(lote);
        }

        [HttpPost]
        public async Task<ActionResult<LoteResponseDto>> CreateLote([FromBody] CreateLoteDto loteDto)
        {
            var rancho = await _context.Ranchos
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id_Rancho == loteDto.Id_Rancho);
            
            if (rancho == null)
                return BadRequest("El rancho no existe");

            bool remoExistente = await _context.Lotes
                .AnyAsync(l => l.Remo == loteDto.Remo);
            
            if (remoExistente)
            {
                return Conflict("Ya existe un lote con el mismo remo en la base de datos");
            }

            string estado;
            if (loteDto.Fecha_Salida.HasValue)
            {
                estado = loteDto.Fecha_Salida.Value.Date <= DateTime.Today ? 
                    "Vendido" : "En proceso de venta";
            }
            else
            {
                estado = "Disponible";
            }

            var lote = new Lote
            {
                Id_User = rancho.Id_User,
                Remo = loteDto.Remo,
                Fecha_Entrada = loteDto.Fecha_Entrada,
                Fecha_Salida = loteDto.Fecha_Salida,
                Observaciones = loteDto.Observaciones,
                Id_Cliente = loteDto.Id_Cliente,
                Estado = estado,
                Fecha_Creacion = DateTime.Now,
                Id_Rancho = loteDto.Id_Rancho,
                User = rancho.User,
                Animales = new List<Animal>()
            };

            _context.Lotes.Add(lote);
            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Registro",
                descripcion: $"Nuevo lote creado: REMO {loteDto.Remo}",
                estado: estado,
                entidadId: lote.Id_Lote,
                tipoEntidad: "Lote"
            );

            return CreatedAtAction(nameof(GetLote), new { id = lote.Id_Lote }, MapLoteToDto(lote));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLote(int id, [FromBody] UpdateLoteDto updateDto)
        {
            if (id != updateDto.Id_Lote)
                return BadRequest("ID no coincide");

            var existingLote = await _context.Lotes
                .Include(l => l.Animales)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);
            if (existingLote == null)
                return NotFound();

            var fechaSalidaCambiada = existingLote.Fecha_Salida != updateDto.Fecha_Salida;
            var remoCambiado = existingLote.Remo != updateDto.Remo;

            existingLote.Remo = updateDto.Remo;
            existingLote.Fecha_Entrada = updateDto.Fecha_Entrada;
            existingLote.Fecha_Salida = updateDto.Fecha_Salida;
            existingLote.Observaciones = updateDto.Observaciones;
            existingLote.Id_Cliente = updateDto.Id_Cliente;

            if (fechaSalidaCambiada)
            {
                existingLote.Estado = updateDto.Fecha_Salida.HasValue ?
                    (updateDto.Fecha_Salida.Value.Date <= DateTime.Today ? 
                        "Vendido" : "En proceso de venta") :
                    "Disponible";
            }

            if (remoCambiado && existingLote.Animales != null)
            {
                foreach (var animal in existingLote.Animales)
                {
                    animal.FoliGuiaRemoSalida = updateDto.Remo.ToString();
                }
            }

            _context.Entry(existingLote).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Actualización",
                descripcion: $"Lote actualizado: REMO {updateDto.Remo}",
                estado: existingLote.Estado,
                entidadId: id,
                tipoEntidad: "Lote"
            );

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.Ventas)
                .Include(l => l.Animales)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);

            if (lote == null)
            {
                return NotFound();
            }

            if (lote.Ventas != null && lote.Ventas.Count > 0)
            {
                return BadRequest(new
                {
                    Message = "No se puede eliminar el lote porque tiene ventas asociadas. " +
                              "Elimine primero las ventas relacionadas."
                });
            }

            foreach (var animal in lote.Animales)
            {
                animal.Id_Lote = null;
                animal.FoliGuiaRemoSalida = null;
            }

            _context.Lotes.Remove(lote);
            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Eliminación",
                descripcion: $"Lote eliminado: REMO {lote.Remo}",
                estado: "Completado",
                entidadId: id,
                tipoEntidad: "Lote"
            );

            return NoContent();
        }
        
        [ApiExplorerSettings(GroupName = "Ventas")]
        [HttpDelete("Completadas/{id}")]
        public async Task<IActionResult> DeleteVentaCompletada(int id)
        {
            var venta = await _context.Ventas
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Animales)
                .FirstOrDefaultAsync(v => v.Id_Venta == id);

            if (venta == null) return NotFound();

            if (venta.Estado != "Completada")
                return BadRequest("Solo se pueden eliminar ventas en estado 'Completada'");

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

            _context.Ventas.Remove(venta);
            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Venta",
                descripcion: $"Venta completada eliminada: ID {id}",
                estado: "Completado",
                entidadId: id,
                tipoEntidad: "Venta"
            );

            return NoContent();
        }
        
        [HttpGet("count/vendidos")]
        public async Task<ActionResult<int>> GetCountLotesVendidos()
        {
            return await _context.Lotes.CountAsync(l => l.Estado == "Vendido");
        }

        [HttpGet("count/disponibles")]
        public async Task<ActionResult<int>> GetCountLotesDisponibles()
        {
            return await _context.Lotes.CountAsync(l => l.Estado == "Disponible");
        }

        private static string CalcularEstado(string estadoActual, DateTime? fechaSalida)
        {
            if (estadoActual == "Vendido") 
                return estadoActual;
            
            if (!fechaSalida.HasValue) 
                return "Disponible";
            
            if (fechaSalida.Value.Date <= DateTime.Today)
                return "Vendido";
            
            return "En proceso de venta";
        }
        
        private LoteResponseDto MapLoteToDto(Lote lote)
        {
            return new LoteResponseDto
            {
                Id_Lote = lote.Id_Lote,
                Id_User = lote.Id_User,
                Remo = lote.Remo,
                Fecha_Entrada = lote.Fecha_Entrada,
                Fecha_Creacion = lote.Fecha_Creacion,
                Fecha_Salida = lote.Fecha_Salida,
                Estado = lote.Estado,
                Observaciones = lote.Observaciones,
                Id_Cliente = lote.Id_Cliente,
                Id_Rancho = lote.Id_Rancho,
                User = lote.User != null ? new UserDto
                {
                    Id_User = lote.User.Id_User,
                    Nombre = lote.User.Name
                } : null,
                Cliente = lote.Cliente != null ? new ClienteDto
                {
                    Id_Cliente = lote.Cliente.Id_Cliente,
                    Nombre = lote.Cliente.Propietario
                } : null,
                Animales = lote.Animales?.Select(a => new AnimalSimpleDto
                {
                    Id_Animal = a.Id_Animal,
                    Arete = a.Arete,
                    Sexo = a.Sexo,
                    Edad_Meses = a.Edad_Meses,
                    Peso = a.Peso
                }).ToList(),
                Rancho = lote.Rancho != null ? new RanchoDto
                {
                    Id_Rancho = lote.Rancho.Id_Rancho,
                    Nombre = lote.Rancho.NombreRancho,
                    Ubicacion = lote.Rancho.Ubicacion
                } : null
            };
        }

        public class CreateLoteDto
        {
            [Required(ErrorMessage = "El Remo es obligatorio")]
            public int Remo { get; set; }
            public DateTime Fecha_Entrada { get; set; }
            public DateTime? Fecha_Salida { get; set; }
            public string? Observaciones { get; set; }
            public int? Id_Cliente { get; set; }
            [Required]
            public int Id_Rancho { get; set; }
        }

        public class UpdateLoteDto
        {
            public int Id_Lote { get; set; }
            public int Remo { get; set; }
            public DateTime Fecha_Entrada { get; set; }
            public DateTime? Fecha_Salida { get; set; }
            public string? Observaciones { get; set; }
            public int? Id_Cliente { get; set; }
        }

        public class LoteResponseDto
        {
            public int Id_Lote { get; set; }
            public int Id_User { get; set; }
            public int Remo { get; set; }
            public DateTime Fecha_Entrada { get; set; }
            public DateTime Fecha_Creacion { get; set; }
            public DateTime? Fecha_Salida { get; set; }
            public string Estado { get; set; }
            public string? Observaciones { get; set; }
            public int? Id_Cliente { get; set; }
            public int? Id_Rancho { get; set; }
            public UserDto User { get; set; }
            public ClienteDto Cliente { get; set; }
            public List<AnimalSimpleDto> Animales { get; set; }
            public RanchoDto Rancho { get; set; }
        }

        public class UserDto
        {
            public int Id_User { get; set; }
            public string Nombre { get; set; }
        }

        public class ClienteDto
        {
            public int Id_Cliente { get; set; }
            public string Nombre { get; set; }
        }

        public class AnimalSimpleDto
        {
            public int Id_Animal { get; set; }
            public string Arete { get; set; }
            public string Sexo { get; set; }
            public int Edad_Meses { get; set; }
            public int Peso { get; set; }
        }

        public class RanchoDto
        {
            public int Id_Rancho { get; set; }
            public string Nombre { get; set; }
            public string Ubicacion { get; set; }
        }
    }
}