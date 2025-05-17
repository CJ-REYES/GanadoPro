namespace GanadoProBackEnd.Models
{
    public class Venta
    {
        public int Id_Venta { get; set; }
        public DateTime FechaProgramada { get; set; }
        public string Cliente { get; set; }
        public string Estado { get; set; }
        public List<Lote> Lotes { get; set; }
    }
}