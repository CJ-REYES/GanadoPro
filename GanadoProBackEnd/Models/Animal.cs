using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
    public class Animal
    {
        public int Id_Animal { get; set; }
        public int Id_User { get; set; }
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
        public DateTime? FechaIngreso { get; set; }
        public DateTime? FechaSalida { get; set; }
        public string? MotivoSalida { get; set; }
        public string? Observaciones { get; set; }
        public string? CertificadoZootanitario { get; set; }
        public string? ContanciaGarrapaticida { get; set; }
        public string? FolioTB { get; set; }
        public string? ValidacionConside_ID { get; set; }
        public byte[]? FierroCliente { get; set; }

        public string? RazonSocial { get; set; }
        public string Estado { get; set; } = "EnStock"; // Valores: EnStock, Vendido, Baja, 
 
    public int? Id_Lote { get; set; }
    public int? Id_Rancho { get; set; }
    public int? Id_Productor { get; set; }
    public int? Id_Cliente { get; set; }

    // Propiedades de navegación
    public Lote Lote { get; set; }
    public User User { get; set; }
    public Rancho Rancho { get; set; }
    public Productores Productores { get; set; }
    public Clientes Clientes { get; set; }
        public DateTime FechaRegistro { get; internal set; }
    }
}