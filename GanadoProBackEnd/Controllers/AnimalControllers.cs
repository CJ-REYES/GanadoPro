using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using System.Globalization;

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
        
        public async Task<ActionResult<IEnumerable<AnimalResponseDto>>> GetAnimales()
        {
            var animales = await _context.Animales
                .Include(a => a.Lote)
                .Include(a => a.Rancho)
                .Include(a => a.Productores)
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
        .Include(a => a.Productores)
        .Include(a => a.Clientes)
        .ToListAsync();

    return animales.Select(a => MapAnimalToDto(a)).ToList();
}


        // GET: Animal por ID
        [HttpGet("{id}")]
       
        public async Task<ActionResult<AnimalResponseDto>> GetAnimal(int id)
        {
            var animal = await _context.Animales
                .Include(a => a.Lote)
                .Include(a => a.Rancho)
                .Include(a => a.Productores)
                .Include(a => a.Clientes)
                .FirstOrDefaultAsync(a => a.Id_Animal == id);

            if (animal == null) return NotFound();

            return MapAnimalToDto(animal);
        }

        // POST: Crear nuevo animal
        [HttpPost]
        
        public async Task<ActionResult<AnimalResponseDto>> CreateAnimal([FromBody] CreateAnimalDto animalDto)
        {
            // Validar rancho
            var rancho = await _context.Ranchos.FindAsync(animalDto.Id_Rancho);
            if (rancho == null) return BadRequest("Rancho no existe");

            // Buscar productor por UPP si se proporciona
            Productores productor = null;
            if (!string.IsNullOrEmpty(animalDto.UppOrigen))
            {
                productor = await _context.Productores
                    .FirstOrDefaultAsync(p => p.Upp == animalDto.UppOrigen);
                
                if (productor == null) 
                    return BadRequest($"No se encontró productor con UPP: {animalDto.UppOrigen}");
            }

            // Buscar cliente por UPP si se proporciona
            Clientes cliente = null;
            if (!string.IsNullOrEmpty(animalDto.UppDestino))
            {
                cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.Upp == animalDto.UppDestino);
                
                if (cliente == null) 
                    return BadRequest($"No se encontró cliente con UPP: {animalDto.UppDestino}");
            }

            // Validar lote si se proporciona
            if (animalDto.Id_Lote.HasValue)
            {
                var lote = await _context.Lotes.FindAsync(animalDto.Id_Lote.Value);
                if (lote == null) return BadRequest("Lote no existe");
            }

            var animal = new Animal
            {
                Id_User = 1, // Obtener del usuario autenticado
                Id_Rancho = animalDto.Id_Rancho,
                Arete = animalDto.Arete,
                Peso = animalDto.Peso ?? 0,
                Sexo = animalDto.Sexo,
                Clasificacion = animalDto.Clasificacion,
                Raza = animalDto.Raza,
                Edad_Meses = animalDto.Edad_Meses,
                FoliGuiaRemoEntrada = animalDto.FoliGuiaRemoEntrada,
                FoliGuiaRemoSalida = animalDto.FoliGuiaRemoSalida,
                UppOrigen = animalDto.UppOrigen,
                UppDestino = animalDto.UppDestino,
                FechaIngreso = animalDto.FechaIngreso ?? DateTime.Now,
                FechaSalida = animalDto.FechaSalida,
                MotivoSalida = animalDto.MotivoSalida,
                Observaciones = animalDto.Observaciones,
                CertificadoZootanitario = animalDto.CertificadoZootanitario,
                ContanciaGarrapaticida = animalDto.ContanciaGarrapaticida,
                FolioTB = animalDto.FolioTB,
                ValidacionConside_ID = animalDto.ValidacionConside_ID,
                FierroCliente = animalDto.FierroCliente != null ? Convert.FromBase64String(animalDto.FierroCliente) : null,
                RazonSocial = animalDto.RazonSocial,
                Estado = animalDto.Estado,
                Id_Lote = animalDto.Id_Lote,
                Id_Productor = productor?.Id_Productor,
                Id_Cliente = cliente?.Id_Cliente,
                FechaRegistro = DateTime.Now
            };

            await _context.Animales.AddAsync(animal);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAnimal), new { id = animal.Id_Animal }, MapAnimalToDto(animal));
        }

        // PUT: Asignar lote a múltiples animales (RUTA FIJA - ANTES DE {id})
        [HttpPut("asignar-lote")]
        
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

        // PUT: Actualizar animal existente
        [HttpPut("{id}")]
       
        public async Task<IActionResult> UpdateAnimal(int id, [FromBody] UpdateAnimalDto updateDto)
        {
            var animal = await _context.Animales
                .Include(a => a.Productores)
                .Include(a => a.Clientes)
                .FirstOrDefaultAsync(a => a.Id_Animal == id);
            
            if (animal == null) return NotFound();

            // Buscar productor por UPP si se actualiza
            if (!string.IsNullOrEmpty(updateDto.UppOrigen) && updateDto.UppOrigen != animal.UppOrigen)
            {
                var productor = await _context.Productores
                    .FirstOrDefaultAsync(p => p.Upp == updateDto.UppOrigen);
                
                if (productor == null) 
                    return BadRequest($"No se encontró productor con UPP: {updateDto.UppOrigen}");
                
                animal.Id_Productor = productor.Id_Productor;
                animal.UppOrigen = updateDto.UppOrigen;
            }

            // Buscar cliente por UPP si se actualiza
            if (!string.IsNullOrEmpty(updateDto.UppDestino) && updateDto.UppDestino != animal.UppDestino)
            {
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.Upp == updateDto.UppDestino);
                
                if (cliente == null) 
                    return BadRequest($"No se encontró cliente con UPP: {updateDto.UppDestino}");
                
                animal.Id_Cliente = cliente.Id_Cliente;
                animal.UppDestino = updateDto.UppDestino;
            }

            // Validar rancho
            if (updateDto.Id_Rancho != animal.Id_Rancho)
            {
                var rancho = await _context.Ranchos.FindAsync(updateDto.Id_Rancho);
                if (rancho == null) return BadRequest("Rancho no existe");
                animal.Id_Rancho = updateDto.Id_Rancho;
            }

            // Validar lote si se actualiza
            if (updateDto.Id_Lote.HasValue && updateDto.Id_Lote != animal.Id_Lote)
            {
                var lote = await _context.Lotes.FindAsync(updateDto.Id_Lote.Value);
                if (lote == null) return BadRequest("Lote no existe");
                animal.Id_Lote = updateDto.Id_Lote;
            }

            // Actualizar campos
            animal.Peso = updateDto.Peso ?? animal.Peso;
            animal.Sexo = updateDto.Sexo ?? animal.Sexo;
            animal.Clasificacion = updateDto.Clasificacion ?? animal.Clasificacion;
            animal.Raza = updateDto.Raza ?? animal.Raza;
            animal.Edad_Meses = updateDto.Edad_Meses;
            animal.FoliGuiaRemoEntrada = updateDto.FoliGuiaRemoEntrada ?? animal.FoliGuiaRemoEntrada;
            animal.FoliGuiaRemoSalida = updateDto.FoliGuiaRemoSalida ?? animal.FoliGuiaRemoSalida;
            
            if (updateDto.FechaIngreso != null)
                animal.FechaIngreso = DateTime.ParseExact(updateDto.FechaIngreso, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            
            if (updateDto.FechaSalida != null)
                animal.FechaSalida = DateTime.ParseExact(updateDto.FechaSalida, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            
            animal.MotivoSalida = updateDto.MotivoSalida ?? animal.MotivoSalida;
            animal.Observaciones = updateDto.Observaciones ?? animal.Observaciones;
            animal.CertificadoZootanitario = updateDto.CertificadoZootanitario ?? animal.CertificadoZootanitario;
            animal.ContanciaGarrapaticida = updateDto.ContanciaGarrapaticida ?? animal.ContanciaGarrapaticida;
            animal.FolioTB = updateDto.FolioTB ?? animal.FolioTB;
            animal.ValidacionConside_ID = updateDto.ValidacionConside_ID ?? animal.ValidacionConside_ID;
            if (updateDto.FierroCliente != null)
                animal.FierroCliente = Convert.FromBase64String(updateDto.FierroCliente);
            animal.RazonSocial = updateDto.RazonSocial ?? animal.RazonSocial;
            animal.Estado = updateDto.Estado ?? animal.Estado;

            _context.Entry(animal).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: Eliminar animal
        [HttpDelete("{id}")]
        
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animales.FindAsync(id);
            if (animal == null) return NotFound();

            _context.Animales.Remove(animal);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Métodos auxiliares
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
                Id_Productor = animal.Id_Productor,
                Id_Cliente = animal.Id_Cliente,
                NombreProductor = animal.Productores?.Name,
                NombreCliente = animal.Clientes?.Name,
                NombreRancho = animal.Rancho?.NombreRancho
            };
        }

        // DTOs
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
            public string Estado { get; set; } = "EnStock";
            public int? Id_Lote { get; set; }
            
            [Required]
            public int Id_Rancho { get; set; }
            
            public int? Id_Productor { get; set; }
            public int? Id_Cliente { get; set; }
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
            public int? Id_Productor { get; set; }
            public int? Id_Cliente { get; set; }
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