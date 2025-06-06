﻿// <auto-generated />
using System;
using GanadoProBackEnd.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    [DbContext(typeof(MyDbContext))]
    [Migration("20250520233520_RemoveEmailFromRancho")]
    partial class RemoveEmailFromRancho
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("GanadoProBackEnd.Models.Animal", b =>
                {
                    b.Property<int>("Id_Animal")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id_Animal"));

                    b.Property<int>("Arete")
                        .HasColumnType("int");

                    b.Property<string>("Categoria")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Clasificacion")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Edad_Meses")
                        .HasColumnType("int");

                    b.Property<DateTime?>("FechaCompra")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("Fecha_Registro")
                        .HasColumnType("datetime(6)");

                    b.Property<int?>("Id_Lote")
                        .HasColumnType("int");

                    b.Property<int>("Id_Rancho")
                        .HasColumnType("int");

                    b.Property<int>("LoteId_Lote")
                        .HasColumnType("int");

                    b.Property<string>("Origen")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Peso")
                        .HasColumnType("int");

                    b.Property<string>("Raza")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Sexo")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id_Animal");

                    b.HasIndex("Id_Rancho");

                    b.HasIndex("LoteId_Lote");

                    b.ToTable("Animales");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Corrales", b =>
                {
                    b.Property<int>("Id_Corrales")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id_Corrales"));

                    b.Property<int>("CapacidadMaxima")
                        .HasColumnType("int");

                    b.Property<string>("Estado")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Id_Rancho")
                        .HasColumnType("int");

                    b.Property<string>("NombreCorral")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Notas")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("RanchoId_Rancho")
                        .HasColumnType("int");

                    b.Property<string>("TipoGanado")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id_Corrales");

                    b.HasIndex("RanchoId_Rancho");

                    b.ToTable("Corrales");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Lote", b =>
                {
                    b.Property<int>("Id_Lote")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id_Lote"));

                    b.Property<string>("Comunidad")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int?>("CorralesId_Corrales")
                        .HasColumnType("int");

                    b.Property<string>("Estado")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Fecha_Creacion")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("Fecha_Entrada")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("Fecha_Salida")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Id_Rancho")
                        .HasColumnType("int");

                    b.Property<string>("Observaciones")
                        .HasColumnType("longtext");

                    b.Property<int>("Remo")
                        .HasMaxLength(50)
                        .HasColumnType("int");

                    b.Property<string>("Upp")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id_Lote");

                    b.HasIndex("CorralesId_Corrales");

                    b.HasIndex("Id_Rancho");

                    b.ToTable("Lotes");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Rancho", b =>
                {
                    b.Property<int>("Id_Rancho")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id_Rancho"));

                    b.Property<int>("Id_User")
                        .HasColumnType("int");

                    b.Property<string>("NombreRancho")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Ubicacion")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id_Rancho");

                    b.HasIndex("Id_User");

                    b.ToTable("Ranchos");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.User", b =>
                {
                    b.Property<int>("Id_User")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id_User"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Telefono")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Upp")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id_User");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Venta", b =>
                {
                    b.Property<int>("Id_Venta")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id_Venta"));

                    b.Property<string>("Cliente")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Estado")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("FechaVenta")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Id_Rancho")
                        .HasColumnType("int");

                    b.HasKey("Id_Venta");

                    b.HasIndex("Id_Rancho");

                    b.ToTable("Ventas");
                });

            modelBuilder.Entity("LoteVenta", b =>
                {
                    b.Property<int>("LotesId_Lote")
                        .HasColumnType("int");

                    b.Property<int>("VentasId_Venta")
                        .HasColumnType("int");

                    b.HasKey("LotesId_Lote", "VentasId_Venta");

                    b.HasIndex("VentasId_Venta");

                    b.ToTable("LoteVenta");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Animal", b =>
                {
                    b.HasOne("GanadoProBackEnd.Models.Rancho", "Rancho")
                        .WithMany()
                        .HasForeignKey("Id_Rancho")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GanadoProBackEnd.Models.Lote", "Lote")
                        .WithMany("Animales")
                        .HasForeignKey("LoteId_Lote")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Lote");

                    b.Navigation("Rancho");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Corrales", b =>
                {
                    b.HasOne("GanadoProBackEnd.Models.Rancho", "Rancho")
                        .WithMany()
                        .HasForeignKey("RanchoId_Rancho")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Rancho");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Lote", b =>
                {
                    b.HasOne("GanadoProBackEnd.Models.Corrales", null)
                        .WithMany("Lotes")
                        .HasForeignKey("CorralesId_Corrales");

                    b.HasOne("GanadoProBackEnd.Models.Rancho", "Rancho")
                        .WithMany("Lotes")
                        .HasForeignKey("Id_Rancho")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Rancho");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Rancho", b =>
                {
                    b.HasOne("GanadoProBackEnd.Models.User", "User")
                        .WithMany("Ranchos")
                        .HasForeignKey("Id_User")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Venta", b =>
                {
                    b.HasOne("GanadoProBackEnd.Models.Rancho", "Rancho")
                        .WithMany()
                        .HasForeignKey("Id_Rancho")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Rancho");
                });

            modelBuilder.Entity("LoteVenta", b =>
                {
                    b.HasOne("GanadoProBackEnd.Models.Lote", null)
                        .WithMany()
                        .HasForeignKey("LotesId_Lote")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GanadoProBackEnd.Models.Venta", null)
                        .WithMany()
                        .HasForeignKey("VentasId_Venta")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Corrales", b =>
                {
                    b.Navigation("Lotes");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Lote", b =>
                {
                    b.Navigation("Animales");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.Rancho", b =>
                {
                    b.Navigation("Lotes");
                });

            modelBuilder.Entity("GanadoProBackEnd.Models.User", b =>
                {
                    b.Navigation("Ranchos");
                });
#pragma warning restore 612, 618
        }
    }
}
