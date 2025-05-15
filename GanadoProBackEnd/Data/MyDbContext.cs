using Microsoft.EntityFrameworkCore;
using GanadoProBackEnd.Models;

namespace GanadoProBackEnd.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

public DbSet<User> Users { get; set; }
public DbSet<Lote> Lotes { get; set; } // Cambiado a plural
public DbSet<Animal> Animales { get; set; }
public DbSet<Rancho> Ranchos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración de PKs (asumiendo que las propiedades en las clases se llaman "Id")
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id_User); // Si la propiedad en User.cs es "Id"

            modelBuilder.Entity<Rancho>()
                .HasKey(r => r.Id_Rancho); // PK para Rancho

            modelBuilder.Entity<Lote>()
                .HasKey(l => l.Id_Lote); // PK para Lote

            modelBuilder.Entity<Animal>()
                .HasKey(a => a.Id_Animal); // PK para Animal

            // Relación User (1) -> Rancho (muchos)
            modelBuilder.Entity<Rancho>()
                .HasOne(r => r.User) // Propiedad de navegación en Rancho (debe llamarse "User")
                .WithMany(u => u.Rancho) // Colección en User (debe llamarse "Ranchos")
                .HasForeignKey(r => r.Id_User); // FK en Rancho (propiedad "Id_User")

            // Relación Rancho (1) -> Lote (muchos)
            modelBuilder.Entity<Lote>()
                .HasOne(l => l.Rancho) // Propiedad de navegación en Lote (debe llamarse "Rancho")
                .WithMany(r => r.Lote) // Colección en Rancho (debe llamarse "Lotes")
                .HasForeignKey(l => l.Id_Rancho); // FK en Lote (propiedad "Id_Rancho")

            // Relación Lote (1) -> Animal (muchos)
            modelBuilder.Entity<Animal>()
                .HasOne(a => a.Lote) // Propiedad de navegación en Animal (debe llamarse "Lote")
                .WithMany(l => l.Animales) // Colección en Lote (debe llamarse "Animales")
                .HasForeignKey(a => a.Id_Lote); // FK en Animal (propiedad "Id_Lote")
        }
    }
}