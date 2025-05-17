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
public DbSet<Corrales> Corrales { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Corrales>().HasKey(c => c.Id_Corrales);
    modelBuilder.Entity<User>().HasKey(u => u.Id_User);
    modelBuilder.Entity<Rancho>().HasKey(r => r.Id_Rancho);
    modelBuilder.Entity<Lote>().HasKey(l => l.Id_Lote);
    modelBuilder.Entity<Animal>().HasKey(a => a.Id_Animal);

    // Rancho -> Corrales (un rancho tiene muchos corrales)
    modelBuilder.Entity<Rancho>()
        .HasMany(r => r.Corrales)
        .WithOne(c => c.Rancho)
        .HasForeignKey(c => c.Id_Rancho)
        .OnDelete(DeleteBehavior.Cascade);

    // Corrales -> Lote (un corral tiene muchos lotes)
    modelBuilder.Entity<Corrales>()
        .HasMany(c => c.Lotes)
        .WithOne(l => l.corrales) // Cambia 'Corrales' por el nombre correcto de la propiedad de navegación en Lote
        .HasForeignKey(l => l.Id_Corrales)
        .OnDelete(DeleteBehavior.Cascade);

    // Lote -> Animal (un lote tiene muchos animales)
    modelBuilder.Entity<Lote>()
        .HasMany(l => l.Animales)
        .WithOne(a => a.Lote)
        .HasForeignKey(a => a.Id_Lote)
        .OnDelete(DeleteBehavior.Cascade);

    // User -> Rancho (un usuario tiene muchos ranchos)
    modelBuilder.Entity<User>()
        .HasMany(u => u.Ranchos)
        .WithOne(r => r.User)
        .HasForeignKey(r => r.Id_User)
        .OnDelete(DeleteBehavior.Cascade);
}
    }
}