using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GanadoProBackEnd.Models
{
    public class Productores
    {
        public int Id { get; set; }
         public int IdFierros_Productores { get; set; }
        public string Name { get; set; }
        public string Propietario { get; set; }
        public string Domicilio { get; set; }
        public string Localidad { get; set; }
        public string Municipio { get; set; }
        public string Entidad { get; set; }
        public string Upp { get; set; }
        public ICollection<Rancho> Ranchos { get; set; } = new List<Rancho>();
    }
}