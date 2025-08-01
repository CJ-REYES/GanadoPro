using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using System.Security.Claims;

public class ActividadService : IActividadService
{
    private readonly MyDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ActividadService(MyDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task RegistrarActividadAsync(string tipo, string descripcion, string? estado = null, string? accion = null, int? entidadId = null, string? tipoEntidad = null)
    {
        // Obtener ID de usuario autenticado
        int? userId = null;
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userIdClaim))
        {
            userId = int.Parse(userIdClaim);
        }

        var actividad = new Actividad
        {
            Tipo = tipo,
            Descripcion = descripcion,
            Tiempo = DateTime.Now,
            Estado = estado,
            Accion = accion,
            EntidadId = entidadId,
            TipoEntidad = tipoEntidad,
            UsuarioId = userId
        };

        _context.Actividades.Add(actividad);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Actividad>> ObtenerActividadesRecientesAsync(int count = 10)
    {
        return await _context.Actividades
            .Include(a => a.Usuario)
            .OrderByDescending(a => a.Tiempo)
            .Take(count)
            .ToListAsync();
    }
}