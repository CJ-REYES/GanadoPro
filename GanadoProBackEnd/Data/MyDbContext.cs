using GanadoProBackEnd.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace GanadoProBackEnd.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<Animal> Animales { get; set; }
        public DbSet<Clientes> Clientes { get; set; }
        public DbSet<Fierros> Fierros { get; set; }
        public DbSet<Lote> Lotes { get; set; }        public DbSet<Rancho> Ranchos { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Venta> Ventas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de Animal
            modelBuilder.Entity<Animal>(entity =>
            {
                entity.HasKey(e => e.Id_Animal);
                
                entity.Property(e => e.Estado)
                    .HasDefaultValue("EnStock");
                
                // Relaciones
                entity.HasOne(a => a.Lote)
                    .WithMany(l => l.Animales)
                    .HasForeignKey(a => a.Id_Lote)
                    .OnDelete(DeleteBehavior.SetNull);
                
                entity.HasOne(a => a.Rancho)
                    .WithMany()
                    .HasForeignKey(a => a.Id_Rancho)
                    .OnDelete(DeleteBehavior.SetNull);
                
                
                
                entity.HasOne(a => a.Clientes)
                    .WithMany(c => c.Animales)
                    .HasForeignKey(a => a.Id_Cliente)
                    .OnDelete(DeleteBehavior.SetNull);
                    
                // Relación con User (FALTANTE)
                entity.HasOne(a => a.User)
                    .WithMany(u => u.Animals)
                    .HasForeignKey(a => a.Id_User)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configuración de Clientes
            modelBuilder.Entity<Clientes>(entity =>
            {
                entity.HasKey(e => e.Id_Cliente);
                
                // Relación con User (FALTANTE)
                entity.HasOne(c => c.User)
                    .WithMany(u => u.Clientes)
                    .HasForeignKey(c => c.Id_User)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasMany(c => c.Animales)
                    .WithOne(a => a.Clientes)
                    .HasForeignKey(a => a.Id_Cliente);
                
                entity.HasMany(c => c.Lotes)
                    .WithOne(l => l.Cliente)
                    .HasForeignKey(l => l.Id_Cliente);
                
                entity.HasMany(c => c.Ventas)
                    .WithOne(v => v.Cliente)
                    .HasForeignKey(v => v.Id_Cliente);
            });

            // Configuración de Fierros
            modelBuilder.Entity<Fierros>(entity =>
            {
                entity.HasKey(e => e.Id_Fierro);
            });

          


            // Configuración de Lote
            modelBuilder.Entity<Lote>(entity =>
            {
                entity.HasKey(e => e.Id_Lote);
                
                entity.Property(e => e.Estado)
                    .HasDefaultValue("Disponible");
                
                entity.Property(e => e.Fecha_Creacion)
                    .HasDefaultValue(DateTime.UtcNow); // Usar UTC
                
                // Relación con User (FALTANTE)
                entity.HasOne(l => l.User)
                    .WithMany(u => u.Lotes)
                    .HasForeignKey(l => l.Id_User)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(l => l.Rancho)
                    .WithMany(r => r.Lotes)
                    .HasForeignKey(l => l.Id_Rancho);
                
                entity.HasOne(l => l.Cliente)
                    .WithMany(c => c.Lotes)
                    .HasForeignKey(l => l.Id_Cliente);
                
                entity.HasMany(l => l.Animales)
                    .WithOne(a => a.Lote)
                    .HasForeignKey(a => a.Id_Lote);
            });

            // Configuración de Productores
           
            // Configuración de Rancho
            modelBuilder.Entity<Rancho>(entity =>
            {
                entity.HasKey(e => e.Id_Rancho);

                entity.HasOne(r => r.User)
                    .WithMany(u => u.Ranchos)
                    .HasForeignKey(r => r.Id_User)
                    .OnDelete(DeleteBehavior.Restrict);
                    modelBuilder.Entity<Rancho>()
    .HasOne(r => r.User)
    .WithMany(u => u.Ranchos)
    .HasForeignKey(r => r.Id_User);
            });

            // Configuración de User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id_User);
            });

            // Configuración de Venta (CORRECCIONES IMPORTANTES)
            modelBuilder.Entity<Venta>(entity =>
            {
                entity.HasKey(e => e.Id_Venta);
                modelBuilder.Entity<Rancho>()
    .HasOne(r => r.User)
    .WithMany(u => u.Ranchos)
    .HasForeignKey(r => r.Id_User)
    .OnDelete(DeleteBehavior.Restrict); // o Cascade, según lo que quieras

                
                // Relación con User (FALTANTE)
                entity.HasOne(v => v.User)
                    .WithMany(u => u.Ventas)
                    .HasForeignKey(v => v.Id_User)
                    .OnDelete(DeleteBehavior.Restrict);
                
               
                // Relación muchos-a-muchos con Lote (CORREGIDA)
                entity.HasMany(v => v.LotesVendidos)
                    .WithMany(l => l.Ventas)
                    .UsingEntity<Dictionary<string, object>>(
                        "VentaLotes",
                        j => j.HasOne<Lote>()
                            .WithMany()
                            .HasForeignKey("Id_Lote")
                            .OnDelete(DeleteBehavior.Restrict),
                        j => j.HasOne<Venta>()
                            .WithMany()
                            .HasForeignKey("Id_Venta")
                            .OnDelete(DeleteBehavior.Restrict),
                        j => j.HasKey("Id_Venta", "Id_Lote")
                    );
            });


            
        }
    }
}