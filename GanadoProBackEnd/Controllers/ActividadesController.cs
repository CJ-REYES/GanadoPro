using GanadoProBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class ActividadesController : ControllerBase
    {
        private readonly IActividadService _actividadService;

        public ActividadesController(IActividadService actividadService)
        {
            _actividadService = actividadService;
        }

        [HttpGet("recientes")]
        [Authorize(AuthenticationSchemes = "Bearer")] // Especificar esquema
        public async Task<ActionResult<IEnumerable<ActividadResponse>>> GetActividadesRecientes()
        {
            var actividades = await _actividadService.ObtenerActividadesRecientesAsync();
            var response = actividades.Select(a => new ActividadResponse
            {
                Id = a.Id,
                Tipo = a.Tipo,
                Descripcion = a.Descripcion,
                Tiempo = a.Tiempo,
                Estado = a.Estado,
                Accion = a.Accion,
                EntidadId = a.EntidadId,
                TipoEntidad = a.TipoEntidad
            }).ToList();

            return Ok(response);
        }
    }

    public class ActividadResponse
    {
        public int Id { get; set; }
        public string Tipo { get; set; }
        public string Descripcion { get; set; }
        public DateTime Tiempo { get; set; }
        public string Estado { get; set; }
        public string Accion { get; set; }
        public int? EntidadId { get; set; }
        public string TipoEntidad { get; set; }
    }
}