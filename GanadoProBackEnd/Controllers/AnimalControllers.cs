using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using GanadoProBackEnd.Services;

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnimalesController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IActividadService _actividadService;

        public AnimalesController(MyDbContext context, IActividadService actividadService)
        {
            _context = context;
            _actividadService = actividadService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnimalResponseDto>>> GetAnimales()
        {
            var animales = await _context.Animales
                .Include(a => a.Lote)
                .Include(a => a.Rancho)
                .Include(a => a.Clientes)
                .ToListAsync();

            return animales.Select(a => MapAnimalToDto(a)).ToList();
        }

        [HttpGet("comprados")]
        public async Task<ActionResult<IEnumerable<AnimalResponseDto>>> GetAnimalesComprados()
        {
            var animales = await _context.Animales
                .Where(a => !string.IsNullOrEmpty(a.UppOrigen) && a.Estado != "EnStock")
                .Include(a => a.Lote)
                .Include(a => a.Rancho)
                .Include(a => a.Clientes)
                .ToListAsync();

            return animales.Select(a => MapAnimalToDto(a)).ToList();
        }

        [HttpGet("enstock")]
        public async Task<ActionResult<IEnumerable<AnimalEnStockDto>>> GetAnimalesEnStock()
        {
            var animales = await _context.Animales
                .Where(a => a.Estado == "EnStock" && a.Id_Lote == null)
                .ToListAsync();

            return animales.Select(a => new AnimalEnStockDto
            {
                Id_Animal = a.Id_Animal,
                Arete = a.Arete,
                Sexo = a.Sexo,
                Edad_Meses = a.Edad_Meses,
                Peso = a.Peso,
                Raza = a.Raza,
                Id_Lote = a.Id_Lote
            }).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AnimalResponseDto>> GetAnimal(int id)
        {
            var animal = await _context.Animales
                .Include(a => a.Lote)
                .Include(a => a.Rancho)
                .Include(a => a.Clientes)
                .FirstOrDefaultAsync(a => a.Id_Animal == id);

            if (animal == null) return NotFound();

            return MapAnimalToDto(animal);
        }

        [HttpPost]
        public async Task<ActionResult<AnimalResponseDto>> CreateAnimal([FromBody] CreateAnimalDto animalDto)
        {
            var rancho = await _context.Ranchos.FindAsync(animalDto.Id_Rancho);
            if (rancho == null)
                return BadRequest(new { Message = "Rancho no existe", Field = "Id_Rancho" });

            int? idProductor = null;
            if (!string.IsNullOrEmpty(animalDto.UppOrigen))
            {
                var productor = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.Upp == animalDto.UppOrigen && c.Rol == "Productor");

                if (productor == null)
                    return BadRequest(new
                    {
                        Message = "UPP Origen no pertenece a un productor válido",
                        Field = "UppOrigen"
                    });

                idProductor = productor.Id_Cliente;
            }

            int? idCliente = null;
            if (!string.IsNullOrEmpty(animalDto.UppDestino))
            {
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.Upp == animalDto.UppDestino && c.Rol == "Cliente");

                if (cliente == null)
                    return BadRequest(new
                    {
                        Message = "UPP Destino no pertenece a un cliente válido",
                        Field = "UppDestino"
                    });

                idCliente = cliente.Id_Cliente;
            }
            
            bool areteExiste = await _context.Animales
                .AnyAsync(a => a.Arete == animalDto.Arete);
            
            if (areteExiste)
            {
                return BadRequest(new 
                { 
                    Message = "El arete ya está registrado en otro animal", 
                    Field = "Arete" 
                });
            }

            if (animalDto.Id_Lote.HasValue && animalDto.Id_Lote.Value > 0)
            {
                var lote = await _context.Lotes.FindAsync(animalDto.Id_Lote.Value);
                if (lote == null)
                    return BadRequest(new { Message = "Lote no existe", Field = "Id_Lote" });
            }
            else
            {
                animalDto.Id_Lote = null;
            }

            var animal = new Animal
            {
                Id_User = 1,
                Id_Rancho = animalDto.Id_Rancho,
                Arete = animalDto.Arete,
                Peso = animalDto.Peso ?? 0,
                Sexo = animalDto.Sexo,
                Clasificacion = animalDto.Clasificacion,
                Raza = animalDto.Raza,
                Edad_Meses = animalDto.Edad_Meses,
                FoliGuiaRemoEntrada = animalDto.FoliGuiaRemoEntrada,
                UppOrigen = animalDto.UppOrigen,
                UppDestino = animalDto.UppDestino,
                FechaIngreso = animalDto.FechaIngreso ?? DateTime.Now,
                MotivoSalida = animalDto.MotivoSalida,
                Observaciones = animalDto.Observaciones,
                CertificadoZootanitario = animalDto.CertificadoZootanitario,
                ContanciaGarrapaticida = animalDto.ContanciaGarrapaticida,
                FolioTB = animalDto.FolioTB,
                ValidacionConside_ID = animalDto.ValidacionConside_ID,
                FierroCliente = animalDto.FierroCliente != null ? Convert.FromBase64String(animalDto.FierroCliente) : null,
                RazonSocial = animalDto.RazonSocial,
                Estado = "EnStock",
                Id_Lote = animalDto.Id_Lote,
                Id_Cliente = idCliente,
                FechaRegistro = DateTime.Now
            };

            await _context.Animales.AddAsync(animal);
            await _context.SaveChangesAsync();

            await _actividadService.RegistrarActividadAsync(
                tipo: "Registro",
                descripcion: $"Nuevo animal registrado: {animalDto.Arete}",
                estado: "Completado",
                entidadId: animal.Id_Animal,
                tipoEntidad: "Animal"
            );

            return CreatedAtAction(nameof(GetAnimal), new { id = animal.Id_Animal }, MapAnimalToDto(animal));
        }

        [HttpPut("asignar-lote")]
        [Authorize]
        public async Task<IActionResult> AsignarLoteAMultiplesAnimales([FromBody] AsignarLoteDto request)
        {
            var lote = await _context.Lotes.FindAsync(request.Id_Lote);
            if (lote == null) return BadRequest("Lote no existe");

            var animales = await _context.Animales
                .Where(a => request.Ids_Animales.Contains(a.Id_Animal))
                .ToListAsync();

            foreach (var animal in animales)
            {
                animal.Id_Lote = request.Id_Lote;
                animal.FoliGuiaRemoSalida = lote.Remo.ToString();
            }

            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Movimiento",
                descripcion: $"{animales.Count} animales asignados al lote REMO {lote.Remo}",
                estado: "Completado",
                entidadId: request.Id_Lote,
                tipoEntidad: "Lote"
            );

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnimal(int id, [FromBody] UpdateAnimalDto updateDto)
        {
            var animal = await _context.Animales
                .Include(a => a.Clientes)
                .FirstOrDefaultAsync(a => a.Id_Animal == id);

            if (animal == null) return NotFound();

            if (!string.IsNullOrEmpty(updateDto.UppOrigen))
            {
                var productor = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.Upp == updateDto.UppOrigen && c.Rol == "Productor");

                if (productor == null)
                    return BadRequest(new
                    {
                        Message = "UPP Origen no pertenece a un productor válido",
                        Field = "UppOrigen"
                    });

                animal.UppOrigen = updateDto.UppOrigen;
            }

            if (!string.IsNullOrEmpty(updateDto.UppDestino))
            {
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.Upp == updateDto.UppDestino && c.Rol == "Cliente");

                if (cliente == null)
                    return BadRequest(new
                    {
                        Message = "UPP Destino no pertenece a un cliente válido",
                        Field = "UppDestino"
                    });

                animal.UppDestino = updateDto.UppDestino;
                animal.Id_Cliente = cliente.Id_Cliente;
            }

            if (updateDto.Id_Rancho != animal.Id_Rancho)
            {
                var rancho = await _context.Ranchos.FindAsync(updateDto.Id_Rancho);
                if (rancho == null)
                    return BadRequest(new { Message = "Rancho no existe", Field = "Id_Rancho" });

                animal.Id_Rancho = updateDto.Id_Rancho;
            }

            if (updateDto.Id_Lote.HasValue && updateDto.Id_Lote != animal.Id_Lote)
            {
                if (updateDto.Id_Lote.Value > 0)
                {
                    var lote = await _context.Lotes.FindAsync(updateDto.Id_Lote.Value);
                    if (lote == null)
                        return BadRequest(new { Message = "Lote no existe", Field = "Id_Lote" });

                    animal.Id_Lote = updateDto.Id_Lote;
                    animal.FoliGuiaRemoSalida = lote.Remo.ToString();
                }
                else
                {
                    animal.Id_Lote = null;
                    animal.FoliGuiaRemoSalida = null;
                }
            }

            animal.Arete = updateDto.Arete ?? animal.Arete;
            animal.Peso = updateDto.Peso ?? animal.Peso;
            animal.Sexo = updateDto.Sexo ?? animal.Sexo;
            animal.Clasificacion = updateDto.Clasificacion ?? animal.Clasificacion;
            animal.Raza = updateDto.Raza ?? animal.Raza;
            animal.Edad_Meses = updateDto.Edad_Meses;
            animal.FoliGuiaRemoEntrada = updateDto.FoliGuiaRemoEntrada ?? animal.FoliGuiaRemoEntrada;

            if (!string.IsNullOrEmpty(updateDto.FechaIngreso))
                animal.FechaIngreso = DateTime.ParseExact(updateDto.FechaIngreso, "yyyy-MM-dd", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(updateDto.FechaSalida))
                animal.FechaSalida = DateTime.ParseExact(updateDto.FechaSalida, "yyyy-MM-dd", CultureInfo.InvariantCulture);

            animal.MotivoSalida = updateDto.MotivoSalida ?? animal.MotivoSalida;
            animal.Observaciones = updateDto.Observaciones ?? animal.Observaciones;
            animal.CertificadoZootanitario = updateDto.CertificadoZootanitario ?? animal.CertificadoZootanitario;
            animal.ContanciaGarrapaticida = updateDto.ContanciaGarrapaticida ?? animal.ContanciaGarrapaticida;
            animal.FolioTB = updateDto.FolioTB ?? animal.FolioTB;
            animal.ValidacionConside_ID = updateDto.ValidacionConside_ID ?? animal.ValidacionConside_ID;
            animal.FoliGuiaRemoSalida = updateDto.FoliGuiaRemoSalida ?? animal.FoliGuiaRemoSalida; 

            if (updateDto.FierroCliente != null)
                animal.FierroCliente = Convert.FromBase64String(updateDto.FierroCliente);

            animal.RazonSocial = updateDto.RazonSocial ?? animal.RazonSocial;
            animal.Estado = updateDto.Estado ?? animal.Estado;

            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Actualización",
                descripcion: $"Animal actualizado: {updateDto.Arete ?? animal.Arete}",
                estado: "Completado",
                entidadId: id,
                tipoEntidad: "Animal"
            );

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animales.FindAsync(id);
            if (animal == null) return NotFound();

            _context.Animales.Remove(animal);
            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Eliminación",
                descripcion: $"Animal eliminado: ID {id}",
                estado: "Completado",
                entidadId: id,
                tipoEntidad: "Animal"
            );

            return NoContent();
        }
        
        [HttpPatch("{id}/remover-lote")]
        public async Task<IActionResult> RemoverLoteDeAnimal(int id)
        {
            var animal = await _context.Animales.FindAsync(id);
            if (animal == null) return NotFound();

            animal.Id_Lote = null;
            animal.FoliGuiaRemoSalida = null;
            await _context.SaveChangesAsync();
            
            await _actividadService.RegistrarActividadAsync(
                tipo: "Movimiento",
                descripcion: $"Animal removido de lote: {animal.Arete}",
                estado: "Completado",
                entidadId: id,
                tipoEntidad: "Animal"
            );

            return NoContent();
        }

        [HttpGet("count/enstock")]
        public async Task<ActionResult<int>> GetCountAnimalesEnStock()
        {
            return await _context.Animales.CountAsync(a => a.Estado == "EnStock");
        }

        [HttpGet("count/vendidos")]
        public async Task<ActionResult<int>> GetCountAnimalesVendidos()
        {
            return await _context.Animales.CountAsync(a => a.Estado == "Vendido");
        }

        private AnimalResponseDto MapAnimalToDto(Animal animal)
        {
            return new AnimalResponseDto
            {
                Id_Animal = animal.Id_Animal,
                Arete = animal.Arete,
                Peso = animal.Peso,
                Sexo = animal.Sexo,
                Clasificacion = animal.Clasificacion,
                Raza = animal.Raza,
                Edad_Meses = animal.Edad_Meses,
                FoliGuiaRemoEntrada = animal.FoliGuiaRemoEntrada,
                FoliGuiaRemoSalida = animal.FoliGuiaRemoSalida,
                UppOrigen = animal.UppOrigen,
                UppDestino = animal.UppDestino,
                FechaIngreso = animal.FechaIngreso?.ToString("yyyy-MM-dd"),
                FechaSalida = animal.FechaSalida?.ToString("yyyy-MM-dd"),
                MotivoSalida = animal.MotivoSalida,
                Observaciones = animal.Observaciones,
                CertificadoZootanitario = animal.CertificadoZootanitario,
                ContanciaGarrapaticida = animal.ContanciaGarrapaticida,
                FolioTB = animal.FolioTB,
                ValidacionConside_ID = animal.ValidacionConside_ID,
                FierroCliente = animal.FierroCliente != null ? Convert.ToBase64String(animal.FierroCliente) : null,
                RazonSocial = animal.RazonSocial,
                Estado = animal.Estado,
                Id_Lote = animal.Id_Lote,
                Id_Rancho = animal.Id_Rancho,
                Id_Cliente = animal.Id_Cliente,
                NombreRancho = animal.Rancho?.NombreRancho
            };
        }

        public class AnimalEnStockDto
        {
            public int Id_Animal { get; set; }
            public string Arete { get; set; }
            public string Sexo { get; set; }
            public int Edad_Meses { get; set; }
            public int? Peso { get; set; }
            public string Raza { get; set; }
            public int? Id_Lote { get; set; }
        }

        public class CreateAnimalDto
        {
            [Required]
            public string Arete { get; set; }

            public int? Peso { get; set; }

            [Required]
            public string Sexo { get; set; }

            [Required]
            public string Raza { get; set; }

            public string? Clasificacion { get; set; }
            public int Edad_Meses { get; set; }
            public string? FoliGuiaRemoEntrada { get; set; }
            public string? UppOrigen { get; set; }
            public string? UppDestino { get; set; }
            public DateTime? FechaIngreso { get; set; }
            public string? MotivoSalida { get; set; }
            public string? Observaciones { get; set; }
            public string? CertificadoZootanitario { get; set; }
            public string? ContanciaGarrapaticida { get; set; }
            public string? FolioTB { get; set; }
            public string? ValidacionConside_ID { get; set; }
            public string? FierroCliente { get; set; }
            public string? RazonSocial { get; set; }
            public string Estado { get; set; } = "EnStock";
            public int? Id_Lote { get; set; }

            [Required]
            public int Id_Rancho { get; set; }
        }

        public class UpdateAnimalDto
        {
            public string? Arete { get; set; }
            public int? Peso { get; set; }
            public string? Sexo { get; set; }
            public string? Raza { get; set; }
            public string? Clasificacion { get; set; }
            public int Edad_Meses { get; set; }
            public string? FoliGuiaRemoEntrada { get; set; }
            public string? FoliGuiaRemoSalida { get; set; }
            public string? UppOrigen { get; set; }
            public string? UppDestino { get; set; }
            public string? FechaIngreso { get; set; }
            public string? FechaSalida { get; set; }
            public string? MotivoSalida { get; set; }
            public string? Observaciones { get; set; }
            public string? CertificadoZootanitario { get; set; }
            public string? ContanciaGarrapaticida { get; set; }
            public string? FolioTB { get; set; }
            public string? ValidacionConside_ID { get; set; }
            public string? FierroCliente { get; set; }
            public string? RazonSocial { get; set; }
            public string? Estado { get; set; }
            public int? Id_Lote { get; set; }
            public int Id_Rancho { get; set; }
        }

        public class AnimalResponseDto
        {
            public int Id_Animal { get; set; }
            public string Arete { get; set; }
            public int Peso { get; set; }
            public string Sexo { get; set; }
            public string? Clasificacion { get; set; }
            public string Raza { get; set; }
            public int Edad_Meses { get; set; }
            public string? FoliGuiaRemoEntrada { get; set; }
            public string? FoliGuiaRemoSalida { get; set; }
            public string? UppOrigen { get; set; }
            public string? UppDestino { get; set; }
            public string? FechaIngreso { get; set; }
            public string? FechaSalida { get; set; }
            public string? MotivoSalida { get; set; }
            public string? Observaciones { get; set; }
            public string? CertificadoZootanitario { get; set; }
            public string? ContanciaGarrapaticida { get; set; }
            public string? FolioTB { get; set; }
            public string? ValidacionConside_ID { get; set; }
            public string? FierroCliente { get; set; }
            public string? RazonSocial { get; set; }
            public string Estado { get; set; }
            public int? Id_Lote { get; set; }
            public int? Id_Rancho { get; set; }
            public int? Id_Productor { get; set; }
            public int? Id_Cliente { get; set; }
            public string? NombreProductor { get; set; }
            public string? NombreCliente { get; set; }
            public string? NombreRancho { get; set; }
        }

        public class AsignarLoteDto
        {
            public int Id_Lote { get; set; }
            public List<int> Ids_Animales { get; set; }
        }
    }
}