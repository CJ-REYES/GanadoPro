using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
    public class AnimalesVendidos
    {
        public int Id { get; set; }
        public int Id_Lote { get; set; }
        public string Arete { get; set; }
        public int Peso { get; set; }
        public string Sexo { get; set; }
        public string Raza { get; set; }
        public string Clasificacion { get; set; }
        public int Edad_Meses { get; set; }
        public string FoliGuiaRemoEntrada { get; set; }
        public string FoliGuiaRemoSalida { get; set; }
        public string UppOrigen { get; set; }
        public string UppDestino { get; set; }
        public string FechaIngreso { get; set; }
        public string FechaSalida { get; set; }
        public string MotivoSalida { get; set; }
        public string Observaciones { get; set; }
        public string CertificadoZootanitario { get; set; }
        public string ContanciaGarrapaticida { get; set; }
        public string FolioTB { get; set; }
        public string ValidacionConside_ID { get; set; }
        public string FierroCliente { get; set; }
        public string Id_Rancho { get; set; }
        public string Id_Cliente { get; set; }
        public string Id_Productores { get; set; }
        public string RazonSocial { get; set; }


    }
}