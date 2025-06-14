 using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GanadoProBackEnd.Models;

public class Clientes
{
    public int Id_Cliente { get; set; }
    public int Id_User { get; set; }
 
    public string Name { get; set; }
    public string Propietario { get; set; }
    public string Domicilio { get; set; }
    public string Localidad { get; set; }
    public string Municipio { get; set; }
    public string Entidad { get; set; }
    public string Upp { get; set; }

    public string Rol { get; set; }
    // Relaciones con otras entidades
    public ICollection<Animal> Animales { get; set; } = new List<Animal>();
    public ICollection<Lote> Lotes { get; set; } = new List<Lote>();
    public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
    public User User { get; set; }
}