using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
    public class Clientes
    {
        public int Id_Cliente { get; set; }
        public int IdFierros_Cliente { get; set; }
        public string Name { get; set; }
        public string Propietario { get; set; }
        public string Domicilio { get; set; }
        public string Localidad { get; set; }
        public string Municipio { get; set; }
        public string Entidad { get; set; }
        public string Upp { get; set; }

public ICollection<Animal> Animales { get; set; } = new List<Animal>();
    public ICollection<Lote> Lotes { get; set; } = new List<Lote>();
    public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
    }   
}