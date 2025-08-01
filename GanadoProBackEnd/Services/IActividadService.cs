using GanadoProBackEnd.Models;

public interface IActividadService
{
    Task RegistrarActividadAsync(string tipo, string descripcion, string? estado = null, string? accion = null, int? entidadId = null, string? tipoEntidad = null);
    Task<List<Actividad>> ObtenerActividadesRecientesAsync(int count = 10);
}