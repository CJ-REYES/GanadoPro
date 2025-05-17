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

            // Configuración de eliminación en cascada (opcional)
            modelBuilder.Entity<Rancho>()
                .HasMany(r => r.Lotes)
                .WithOne(l => l.Rancho)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Lote>()
                .HasMany(l => l.Animales)
                .WithOne(a => a.Lote)
                .OnDelete(DeleteBehavior.Cascade);

            // Relaciones actualizadas con nombres plurales
            modelBuilder.Entity<Rancho>()
                .HasOne(r => r.User)
                .WithMany(u => u.Ranchos) // Coincide con la propiedad en User
                .HasForeignKey(r => r.Id_User);

            modelBuilder.Entity<Lote>()
                .HasOne(l => l.Rancho)
                .WithMany(r => r.Lotes) // Coincide con la propiedad en Rancho
                .HasForeignKey(l => l.Id_Rancho);
             modelBuilder.Entity<Animal>()
        .HasOne(a => a.Lote)
        .WithMany(l => l.Animales)
        .HasForeignKey(a => a.Id_Lote); // ✔️ Usa Id_Lote como FK

        }
    }
}