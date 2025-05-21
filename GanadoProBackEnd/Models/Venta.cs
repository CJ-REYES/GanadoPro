namespace GanadoProBackEnd.Models
{
    public class Venta
    {
        public int Id_Venta { get; set; }
        public int Id_Rancho { get; set; }
        public DateTime FechaVenta { get; set; }
        public string Cliente { get; set; }
        public string Estado { get; set; }
        public List<Lote> Lotes { get; set; }
        public Rancho Rancho { get; set; }
    }
}