using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class GanAniWE : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Productores_Id_Productor",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Productores_Id_Productor",
                table: "Ventas");

            migrationBuilder.DropTable(
                name: "Productores");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_Id_Productor",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Animales_Id_Productor",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "IdFierros_Cliente",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Id_Productor",
                table: "Animales");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 6, 13, 20, 24, 47, 539, DateTimeKind.Utc).AddTicks(5632),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 6, 8, 6, 20, 47, 954, DateTimeKind.Utc).AddTicks(7082));

            migrationBuilder.AddColumn<string>(
                name: "Rol",
                table: "Clientes",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Rol",
                table: "Clientes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 6, 8, 6, 20, 47, 954, DateTimeKind.Utc).AddTicks(7082),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 6, 13, 20, 24, 47, 539, DateTimeKind.Utc).AddTicks(5632));

            migrationBuilder.AddColumn<int>(
                name: "IdFierros_Cliente",
                table: "Clientes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id_Productor",
                table: "Animales",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Productores",
                columns: table => new
                {
                    Id_Productor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Id_User = table.Column<int>(type: "int", nullable: false),
                    Domicilio = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Entidad = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IdFierros_Productores = table.Column<int>(type: "int", nullable: false),
                    Localidad = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Municipio = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Propietario = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Upp = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Productores", x => x.Id_Productor);
                    table.ForeignKey(
                        name: "FK_Productores_Users_Id_User",
                        column: x => x.Id_User,
                        principalTable: "Users",
                        principalColumn: "Id_User",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_Id_Productor",
                table: "Ventas",
                column: "Id_Productor");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_Id_Productor",
                table: "Animales",
                column: "Id_Productor");

            migrationBuilder.CreateIndex(
                name: "IX_Productores_Id_User",
                table: "Productores",
                column: "Id_User");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Productores_Id_Productor",
                table: "Animales",
                column: "Id_Productor",
                principalTable: "Productores",
                principalColumn: "Id_Productor",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Productores_Id_Productor",
                table: "Ventas",
                column: "Id_Productor",
                principalTable: "Productores",
                principalColumn: "Id_Productor",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
