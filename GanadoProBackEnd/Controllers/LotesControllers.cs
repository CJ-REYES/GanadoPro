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

namespace GanadoProBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LotesController : ControllerBase
    {
        private readonly MyDbContext _context;

        public LotesController(MyDbContext context)
        {
            _context = context;
        }

        // GET: Todos los lotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoteResponseDto>>> GetLotes()
        {
            var lotes = await _context.Lotes
                .Include(l => l.User)
                .Include(l => l.Cliente)
                .Include(l => l.Animales) // Asegurar incluir animales
                .Include(l => l.Rancho)
                .ToListAsync();

            return lotes.Select(l => MapLoteToDto(l)).ToList();
        }

        // GET: Lote por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<LoteResponseDto>> GetLote(int id)
        {
            var lote = await _context.Lotes
                .Include(l => l.User)
                .Include(l => l.Cliente)
                .Include(l => l.Animales) // Asegurar incluir animales
                .Include(l => l.Rancho)
                .FirstOrDefaultAsync(l => l.Id_Lote == id);

            if (lote == null)
                return NotFound();

            // Actualizar estado si es necesario
            var nuevoEstado = CalcularEstado(lote.Estado, lote.Fecha_Salida);
            if (nuevoEstado != lote.Estado)
            {
                lote.Estado = nuevoEstado;
                _context.Entry(lote).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            return MapLoteToDto(lote);
        }

        // POST: Crear nuevo lote
        [HttpPost]
        public async Task<ActionResult<LoteResponseDto>> CreateLote([FromBody] CreateLoteDto loteDto)
        {
            // Validar rancho
            var rancho = await _context.Ranchos
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id_Rancho == loteDto.Id_Rancho);
            
            if (rancho == null)
                return BadRequest("El rancho no existe");

            // Verificar si ya existe un remo idéntico
            bool remoExistente = await _context.Lotes
                .AnyAsync(l => l.Remo == loteDto.Remo);
            
            if (remoExistente)
            {
                return Conflict("Ya existe un lote con el mismo remo en la base de datos");
            }

            // Calcular estado automáticamente
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
                Id_User = rancho.Id_User, // Propietario del rancho
                Remo = loteDto.Remo,
                Fecha_Entrada = loteDto.Fecha_Entrada,
                Fecha_Salida = loteDto.Fecha_Salida,
                Observaciones = loteDto.Observaciones,
                Id_Cliente = loteDto.Id_Cliente,
                Estado = estado,
                Fecha_Creacion = DateTime.Now,
                Id_Rancho = loteDto.Id_Rancho,
                User = rancho.User, // Asignar el usuario propietario del rancho
                Animales = new List<Animal>() // Inicializar la lista de animales vacía
            };

            _context.Lotes.Add(lote);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLote), new { id = lote.Id_Lote }, MapLoteToDto(lote));
        }

        // PUT: Actualizar lote existente
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLote(int id, [FromBody] UpdateLoteDto updateDto)
        {
            if (id != updateDto.Id_Lote)
                return BadRequest("ID no coincide");

            var existingLote = await _context.Lotes.FindAsync(id);
            if (existingLote == null)
                return NotFound();

            // Capturar cambios en la fecha de salida
            var fechaSalidaCambiada = existingLote.Fecha_Salida != updateDto.Fecha_Salida;

            existingLote.Remo = updateDto.Remo;
            existingLote.Fecha_Entrada = updateDto.Fecha_Entrada;
            existingLote.Fecha_Salida = updateDto.Fecha_Salida;
            existingLote.Observaciones = updateDto.Observaciones;
            existingLote.Id_Cliente = updateDto.Id_Cliente;

            // Actualizar estado si cambió la fecha de salida
            if (fechaSalidaCambiada)
            {
                existingLote.Estado = updateDto.Fecha_Salida.HasValue ?
                    (updateDto.Fecha_Salida.Value.Date <= DateTime.Today ? 
                        "Vendido" : "En proceso de venta") :
                    "Disponible";
            }

            _context.Entry(existingLote).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: Eliminar lote
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLote(int id)
        {
            var lote = await _context.Lotes.FindAsync(id);
            if (lote == null)
                return NotFound();

            _context.Lotes.Remove(lote);
            await _context.SaveChangesAsync();

            return NoContent();
        }
// Nuevos endpoints en LotesController.cs

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
        // Método auxiliar para calcular el estado actual
        private static string CalcularEstado(string estadoActual, DateTime? fechaSalida)
        {
            // Si ya está vendido, mantener estado
            if (estadoActual == "Vendido") 
                return estadoActual;
            
            // Si no tiene fecha de salida, debe estar disponible
            if (!fechaSalida.HasValue) 
                return "Disponible";
            
            // Si la fecha de salida es hoy o anterior, está vendido
            if (fechaSalida.Value.Date <= DateTime.Today)
                return "Vendido";
            
            // Si tiene fecha futura y no es vendido, está en proceso
            return "En proceso de venta";
        }

        // Mapear Lote a DTO de respuesta
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
                    // Añadir los nuevos campos
                    Sexo = a.Sexo,
                    Edad_Meses = a.Edad_Meses,
                    Peso = a.Peso
                }).ToList(),
                Rancho = lote.Rancho != null ? new RanchoDto
                {
                    Id_Rancho = lote.Rancho.Id_Rancho,
                    Nombre = lote.Rancho.NombreRancho
                } : null
            };
        }

        // DTOs
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
            // Añadir los campos necesarios para animales
            public string Sexo { get; set; }
            public int Edad_Meses { get; set; }
            public int Peso { get; set; }
        }

        public class RanchoDto
        {
            public int Id_Rancho { get; set; }
            public string Nombre { get; set; }
        }
    }
}