using System.Collections.Generic;

namespace GanadoProBackEnd.Models
{
    public enum TipoVenta
    {
        Nacional,
        Internacional
    }

    public class Venta
    {
        public int Id_User { get; set; } // ID del usuario que realiza la venta
        public int Id_Venta { get; set; }
        public int Id_Rancho { get; set; }
        public int Id_Cliente { get; set; }
        public int Id_Productor { get; set; }
        public DateTime FechaSalida { get; set; }
        public string? FolioGuiaRemo { get; set; }
        public string? Estado { get; set; } // "Programada", "Completada", "Cancelada"
        public TipoVenta TipoVenta { get; set; }

        public List<Lote> LotesVendidos { get; set; } = new List<Lote>();
        public Rancho? RanchoOrigen { get; set; }
        public Clientes? Cliente { get; set; }
        
        public User User { get; set; } // Usuario que realiza la venta
    }
}