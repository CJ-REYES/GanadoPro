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

namespace GanadoProBackEnd.Services
{
    public class VentaBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly ILogger<VentaBackgroundService> _logger;

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
                        
                        await ActualizarVentasVencidasAsync(context);
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

        private async Task ActualizarVentasVencidasAsync(MyDbContext context)
        {
            var ventasVencidas = await context.Ventas
                .Include(v => v.LotesVendidos)
                    .ThenInclude(l => l.Animales)
                .Where(v => v.Estado == "Programada" && 
                            v.FechaSalida <= DateTime.Today)
                .ToListAsync();

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
        
        // Método para actualizar estado de venta (reutilizable)
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