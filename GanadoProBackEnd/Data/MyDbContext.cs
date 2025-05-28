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
public DbSet<Venta> Ventas { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Corrales>().HasKey(c => c.Id_Corrales);
            modelBuilder.Entity<User>().HasKey(u => u.Id_User);
            modelBuilder.Entity<Rancho>().HasKey(r => r.Id_Rancho);
            modelBuilder.Entity<Lote>().HasKey(l => l.Id_Lote);
            modelBuilder.Entity<Animal>().HasKey(a => a.Id_Animal);
            modelBuilder.Entity<Venta>().HasKey(v => v.Id_Venta);


                // Configurar el enum como string en la base de datos
    modelBuilder.Entity<User>()
        .Property(u => u.Rol)
        .HasConversion<string>();

               // Configurar relación Rancho -> Lote
    modelBuilder.Entity<Rancho>()
        .HasMany(r => r.Lotes) // Nueva colección en Rancho
        .WithOne(l => l.Rancho)
        .HasForeignKey(l => l.Id_Rancho)
        .OnDelete(DeleteBehavior.Cascade);

    // Configurar relación Animal -> Rancho
    modelBuilder.Entity<Animal>()
        .HasOne(a => a.Rancho)
        .WithMany()
        .HasForeignKey(a => a.Id_Rancho);

    // Configurar relación Venta -> Rancho
    modelBuilder.Entity<Venta>()
        .HasOne(v => v.Rancho)
        .WithMany()
        .HasForeignKey(v => v.Id_Rancho);

    // Configurar relación many-to-many Venta-Lote
    modelBuilder.Entity<Venta>()
        .HasMany(v => v.Lotes)
        .WithMany(l => l.Ventas);


    modelBuilder.Entity<Animal>()
        .HasOne(a => a.Lote)
        .WithMany(l => l.Animales)
        .HasForeignKey(a => a.Id_Lote)
        .IsRequired(false); // Relación opcional


        

            // User -> Rancho (un usuario tiene muchos ranchos)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Ranchos)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.Id_User)
                .OnDelete(DeleteBehavior.Cascade);
         
}
    }
}