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
        public DbSet<InvetarioExportacion> InventarioExportaciones { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<Productores> Productores { get; set; }
        public DbSet<Rancho> Ranchos { get; set; }
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
                
                entity.HasOne(a => a.Productores)
                    .WithMany(p => p.Animales)
                    .HasForeignKey(a => a.Id_Productor)
                    .OnDelete(DeleteBehavior.SetNull);
                
                entity.HasOne(a => a.Clientes)
                    .WithMany(c => c.Animales)
                    .HasForeignKey(a => a.Id_Cliente)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configuración de Clientes
            modelBuilder.Entity<Clientes>(entity =>
            {
                entity.HasKey(e => e.Id_Cliente);
                
                // Relaciones
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

            // Configuración de InventarioExportación
            modelBuilder.Entity<InvetarioExportacion>(entity =>
            {
                entity.HasKey(e => e.Id_InventarioExportacion);
                
                // Relaciones
                entity.HasOne(ie => ie.Lote)
                    .WithMany()
                    .HasForeignKey(ie => ie.Id_Lote);
                
                entity.HasOne(ie => ie.Productor)
                    .WithMany(p => p.Exportaciones)
                    .HasForeignKey(ie => ie.Id_Productor);
            });

            // Configuración de Lote
            modelBuilder.Entity<Lote>(entity =>
            {
                entity.HasKey(e => e.Id_Lote);
                
                entity.Property(e => e.Estado)
                    .HasDefaultValue("Disponible");
                
                entity.Property(e => e.Fecha_Creacion)
                    .HasDefaultValue(DateTime.UtcNow);
                
                // Relaciones
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
            modelBuilder.Entity<Productores>(entity =>
            {
                entity.HasKey(e => e.Id_Productor);
                
                // Relaciones
                entity.HasMany(p => p.Animales)
                    .WithOne(a => a.Productores)
                    .HasForeignKey(a => a.Id_Productor);
                
                entity.HasMany(p => p.Exportaciones)
                    .WithOne(e => e.Productor)
                    .HasForeignKey(e => e.Id_Productor);
                
                entity.HasMany(p => p.Ventas)
                    .WithOne(v => v.Productor)
                    .HasForeignKey(v => v.Id_Productor);
            });

            // Configuración de Rancho
            modelBuilder.Entity<Rancho>(entity =>
            {
                entity.HasKey(e => e.Id_Rancho);
                
                // Relaciones
                entity.HasOne(r => r.User)
                    .WithMany(u => u.Ranchos)
                    .HasForeignKey(r => r.Id_User);
            });

            // Configuración de User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id_User);
            });

            // Configuración de Venta (CORRECCIÓN IMPORTANTE AQUÍ)
            modelBuilder.Entity<Venta>(entity =>
            {
                entity.HasKey(e => e.Id_Venta);
                
                // Relaciones
                entity.HasOne(v => v.RanchoOrigen)
                    .WithMany()
                    .HasForeignKey(v => v.Id_Rancho);
                
                entity.HasOne(v => v.Cliente)
                    .WithMany(c => c.Ventas)
                    .HasForeignKey(v => v.Id_Cliente);
                
                // Relación muchos-a-muchos con Lote
                entity.HasMany(v => v.LotesVendidos)
                    .WithMany(l => l.Ventas)
                    .UsingEntity<Dictionary<string, object>>(
                        "VentaLotes",
                        j => j.HasOne<Lote>()
                            .WithMany()
                            .HasForeignKey("Id_Lote"),
                        j => j.HasOne<Venta>()
                            .WithMany()
                            .HasForeignKey("Id_Venta"),
                        j => j.HasKey("Id_Venta", "Id_Lote")
                    );
            });

            // Corrección de nombres para consistencia
            modelBuilder.Entity<Productores>().ToTable("Productores");
            modelBuilder.Entity<InvetarioExportacion>().ToTable("InventarioExportaciones");
        }
    }
}