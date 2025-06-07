using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnimalesController : ControllerBase
    {
        private readonly MyDbContext _context;

        public AnimalesController(MyDbContext context) => _context = context;

        // GET: Todos los animales
        [HttpGet]
        [Authorize]

        public async Task<ActionResult<IEnumerable<AnimalResponseDto>>> GetAnimales()
        {
            var animales = await _context.Animales
                .Include(a => a.Lote)
                .ToListAsync();

            return animales.Select(a => new AnimalResponseDto
            {
                Id_Animal = a.Id_Animal,
                Arete = a.Arete,
                Peso = a.Peso,
                Sexo = a.Sexo,
                Clasificacion = a.Clasificacion,
                Raza = a.Raza,
                Id_Lote = a.Id_Lote,
                FechaIngreso = a.FechaIngreso != null ? a.FechaIngreso.Value.ToString("yyyy-MM-dd") : null,
                UppOrigen = a.UppOrigen,
                FechaSalida = a.FechaSalida != null ? a.FechaSalida.Value.ToString("yyyy-MM-dd") : null
            }).ToList();
        }

        // GET: Animal por ID
        [HttpGet("{id}")]
        [Authorize]

        public async Task<ActionResult<AnimalResponseDto>> GetAnimal(int id)
        {
            var animal = await _context.Animales
                .Include(a => a.Lote)
                .FirstOrDefaultAsync(a => a.Id_Animal == id);

            if (animal == null) return NotFound();

            return new AnimalResponseDto
            {
                Id_Animal = animal.Id_Animal,
                Arete = animal.Arete,
                Peso = animal.Peso,
                Sexo = animal.Sexo,
                Clasificacion = animal.Clasificacion,
                Raza = animal.Raza,
                Id_Lote = animal.Id_Lote,

                FechaIngreso = (animal.FechaIngreso ?? DateTime.Now).ToString("yyyy-MM-dd"),
                UppOrigen = animal.UppOrigen,
                FechaSalida = (animal.FechaSalida ?? DateTime.Now).ToString("yyyy-MM-dd")
            };
        }

        // GET: Animales comprados
        [HttpGet("comprados")]
        [Authorize]

        public async Task<ActionResult<IEnumerable<AnimalResponseDto>>> GetAnimalesComprados()
        {
            var animales = await _context.Animales
                .Where(a => !string.IsNullOrEmpty(a.UppOrigen))
                .Include(a => a.Lote)
                .ToListAsync();

            return animales.Select(a => new AnimalResponseDto
            {
                Id_Animal = a.Id_Animal,
                Arete = a.Arete,
                Peso = a.Peso,
                Sexo = a.Sexo,
                Clasificacion = a.Clasificacion,
                Raza = a.Raza,
                Id_Lote = a.Id_Lote,

                FechaIngreso = a.FechaIngreso?.ToString("yyyy-MM-dd"),
                UppOrigen = a.UppOrigen,
                FechaSalida = a.FechaSalida?.ToString("yyyy-MM-dd")
            }).ToList();
        }

        [HttpPost]
    [Authorize]

public async Task<ActionResult<AnimalResponseDto>> CreateAnimal([FromBody] CreateAnimalDto animalDto)
        {
            // Validar rancho
            var rancho = await _context.Ranchos.FindAsync(animalDto.Id_Rancho);
            if (rancho == null) return BadRequest("Rancho no existe");

            // Validar lote si se proporciona
            if (animalDto.Id_Lote.HasValue)
            {
                var lote = await _context.Lotes.FindAsync(animalDto.Id_Lote.Value);
                if (lote == null) return BadRequest("Lote no existe");
            }

            var animal = new Animal
            {
                Id_Rancho = animalDto.Id_Rancho,
                Arete = animalDto.Arete,
                Peso = animalDto.Peso ?? 0,
                Sexo = animalDto.Sexo,
                Clasificacion = animalDto.Clasificacion,
              
                Raza = animalDto.Raza,
                Id_Lote = animalDto.Id_Lote, // Acepta null
                UppOrigen = animalDto.UppOrigen,
                FechaSalida = animalDto.FechaSalida,
                FechaIngreso = DateTime.Now
            };

            await _context.Animales.AddAsync(animal);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAnimal), new { id = animal.Id_Animal }, AnimalToResponseDto(animal));
        }

        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> UpdateAnimal(int id, [FromBody] UpdateAnimalDto updateDto)
        {
            var animal = await _context.Animales.FindAsync(id);
            if (animal == null) return NotFound();

            // Validar el lote si se proporciona
            if (updateDto.Id_Lote.HasValue)
            {
                var lote = await _context.Lotes.FindAsync(updateDto.Id_Lote.Value);
                if (lote == null) return BadRequest("Lote no existe");
            }
            animal.Id_Rancho = updateDto.Id_Rancho;
            animal.Peso = updateDto.Peso ?? animal.Peso;
            animal.Sexo = updateDto.Sexo ?? animal.Sexo;
            animal.Clasificacion = updateDto.Clasificacion ?? animal.Clasificacion;
    
            animal.Raza = updateDto.Raza ?? animal.Raza;
            animal.Id_Lote = updateDto.Id_Lote ?? animal.Id_Lote; // Actualizar lote

            _context.Entry(animal).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
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
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DTO adicional
        public class AsignarLoteDto
        {
            public int Id_Lote { get; set; }
            public List<int> Ids_Animales { get; set; }
        }

        // DELETE: Eliminar animal
        [HttpDelete("{id}")]
        [Authorize]

        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animales.FindAsync(id);
            if (animal == null) return NotFound();

            _context.Animales.Remove(animal);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    
        // Helper method to map Animal to AnimalResponseDto
        private AnimalResponseDto AnimalToResponseDto(Animal animal)
        {
            return new AnimalResponseDto
            {
                Id_Animal = animal.Id_Animal,
                Arete = animal.Arete,
                Peso = animal.Peso,
                Sexo = animal.Sexo,
                Clasificacion = animal.Clasificacion,
                Raza = animal.Raza,
                Id_Lote = animal.Id_Lote,

                FechaIngreso = animal.FechaIngreso?.ToString("yyyy-MM-dd"),
                UppOrigen = animal.UppOrigen,
                FechaSalida = animal.FechaSalida?.ToString("yyyy-MM-dd")
            };
        }
       
    }

    // DTOs
    public class CreateAnimalDto
    {
        public string Arete { get; set; }
        public int? Peso { get; set; }
        public string Sexo { get; set; }
        public string Raza { get; set; }
        public string? Clasificacion { get; set; }
        public int Edad_Meses { get; set; }
        public string? FoliGuiaRemoEntrada { get; set; }
        public string? FoliGuiaRemoSalida { get; set; }
        public string? UppOrigen { get; set; }
        public string? UppDestino { get; set; }
        public DateTime? FechaIngreso { get; set; }
        public DateTime? FechaSalida { get; set; }
        public string? MotivoSalida { get; set; }
        public string? Observaciones { get; set; }
        public string? CertificadoZootanitario { get; set; }
        public string? ContanciaGarrapaticida { get; set; }
        public string? FolioTB { get; set; }
        public string? ValidacionConside_ID { get; set; }
        public string? FierroCliente { get; set; }

        public string? RazonSocial { get; set; }
        public string Estado { get; set; } = "EnStock"; // Valores: EnStock, Vendido, Baja, 
 
    public int? Id_Lote { get; set; }
    public int? Id_Rancho { get; set; }
    public int? Id_Productor { get; set; }
    public int? Id_Cliente { get; set; }
    }

    public class UpdateAnimalDto
    {
        public string Arete { get; set; }
        public int? Peso { get; set; }
        public string Sexo { get; set; }
        public string Raza { get; set; }
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
        public string Estado { get; set; } = "EnStock"; // Valores: EnStock, Vendido, Baja, 
 
    public int? Id_Lote { get; set; }
    public int? Id_Rancho { get; set; }
    public int? Id_Productor { get; set; }
    public int? Id_Cliente { get; set; } // Añadido para actualizar lote
    }

    public class AnimalResponseDto
    {
        public int Id_Animal { get; set; }
        public string Arete { get; set; }
        public int Peso { get; set; }
        public string Sexo { get; set; }
        public string Raza { get; set; }
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
        public string Estado { get; set; } = "EnStock"; // Valores: EnStock, Vendido, Baja, 

        public int? Id_Lote { get; set; }
        public int? Id_Rancho { get; set; }
        public int? Id_Productor { get; set; }
        public int? Id_Cliente { get; set; }
    }
   
}