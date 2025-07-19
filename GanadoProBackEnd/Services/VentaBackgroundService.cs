using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using GanadoProBackEnd.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.Logging;
using GanadoProBackEnd.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace GanadoProBackEnd.Services
{
    public class VentaBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly ILogger<VentaBackgroundService> _logger;
        private const int MaxRetryAttempts = 5;
        private readonly TimeSpan RetryDelay = TimeSpan.FromSeconds(10);

        public VentaBackgroundService(
            IServiceProvider services, 
            ILogger<VentaBackgroundService> logger)
        {
            _services = services;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Servicio de actualización de ventas iniciado");
            
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _services.CreateScope())
                    {
                        var context = scope.ServiceProvider
                            .GetRequiredService<MyDbContext>();
                        
                        // Verificar disponibilidad de la base de datos
                        if (await IsDatabaseAvailable(context, MaxRetryAttempts))
                        {
                            await ActualizarVentasVencidasAsync(context);
                        }
                        else
                        {
                            _logger.LogError("La base de datos no está disponible después de múltiples intentos");
                        }
                    }
                    
                    // Esperar hasta mañana a las 00:01
                    var now = DateTime.Now;
                    var tomorrow = now.Date.AddDays(1).AddMinutes(1);
                    var delay = tomorrow - now;
                    
                    await Task.Delay(delay, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error en el servicio de ventas");
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                }
            }
        }

        private async Task<bool> IsDatabaseAvailable(MyDbContext context, int maxAttempts)
        {
            for (int i = 0; i < maxAttempts; i++)
            {
                try
                {
                    _logger.LogInformation($"Verificando conexión a BD (Intento #{i + 1})");
                    return await context.Database.CanConnectAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"Error de conexión a BD (Intento #{i + 1})");
                    await Task.Delay(RetryDelay * (i + 1));
                }
            }
            return false;
        }

        private async Task ActualizarVentasVencidasAsync(MyDbContext context)
        {
            try
            {
                var ventasVencidas = await context.Ventas
                    .Include(v => v.LotesVendidos)
                        .ThenInclude(l => l.Animales)
                    .Where(v => v.Estado == "Programada" && 
                                v.FechaSalida <= DateTime.Today)
                    .ToListAsync();

                _logger.LogInformation($"Encontradas {ventasVencidas.Count} ventas para actualizar");

                foreach (var venta in ventasVencidas)
                {
                    await ActualizarEstadoVenta(context, venta);
                }

                if (ventasVencidas.Any())
                {
                    await context.SaveChangesAsync();
                    _logger.LogInformation($"Actualizadas {ventasVencidas.Count} ventas vencidas");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error durante la actualización de ventas");
                throw;
            }
        }
        
        private async Task ActualizarEstadoVenta(MyDbContext context, Venta venta)
        {
            if (venta.Estado == "Programada" && venta.FechaSalida <= DateTime.Today)
            {
                venta.Estado = "Completada";
                
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
            }
        }
    }
}