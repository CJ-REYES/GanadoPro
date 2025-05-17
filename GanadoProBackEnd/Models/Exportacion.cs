using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
    public class Exportacion
    {
    public int Id { get; set; }
    public string Destino { get; set; }
    public DateTime FechaSalidaEstimada { get; set; }
    public int Cantidad { get; set; }
    public string Raza { get; set; }
    public string Estado { get; set; }
    public string? Alerta { get; set; }

        internal class Include
        {
            private Func<object, object> value;

            public Include(Func<object, object> value)
            {
                this.value = value;
            }
        }
    }
}