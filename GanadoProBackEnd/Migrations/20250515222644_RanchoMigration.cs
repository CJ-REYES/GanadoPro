using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class RanchoMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Lote_Id_Lote",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Lote_Users_Id_User",
                table: "Lote");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Lote",
                table: "Lote");

            migrationBuilder.DropColumn(
                name: "Nombre",
                table: "Lote");

            migrationBuilder.RenameTable(
                name: "Lote",
                newName: "Lotes");

            migrationBuilder.RenameColumn(
                name: "Id_User",
                table: "Lotes",
                newName: "Id_Rancho");

            migrationBuilder.RenameIndex(
                name: "IX_Lote_Id_User",
                table: "Lotes",
                newName: "IX_Lotes_Id_Rancho");

            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Animales",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Edad_Meses",
                table: "Animales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "Fecha_Registro",
                table: "Animales",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "NombreRancho",
                table: "Lotes",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Lotes",
                table: "Lotes",
                column: "Id_Lote");

            migrationBuilder.CreateTable(
                name: "Ranchos",
                columns: table => new
                {
                    Id_Rancho = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Id_User = table.Column<int>(type: "int", nullable: false),
                    NombreRancho = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ubicacion = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Propietario = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Telefono = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CorreoElectronico = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TipoGanado = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CapacidadMaxima = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ranchos", x => x.Id_Rancho);
                    table.ForeignKey(
                        name: "FK_Ranchos_Users_Id_User",
                        column: x => x.Id_User,
                        principalTable: "Users",
                        principalColumn: "Id_User",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Ranchos_Id_User",
                table: "Ranchos",
                column: "Id_User");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales",
                column: "Id_Lote",
                principalTable: "Lotes",
                principalColumn: "Id_Lote",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Ranchos_Id_Rancho",
                table: "Lotes",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Ranchos_Id_Rancho",
                table: "Lotes");

            migrationBuilder.DropTable(
                name: "Ranchos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Lotes",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Edad_Meses",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Fecha_Registro",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "NombreRancho",
                table: "Lotes");

            migrationBuilder.RenameTable(
                name: "Lotes",
                newName: "Lote");

            migrationBuilder.RenameColumn(
                name: "Id_Rancho",
                table: "Lote",
                newName: "Id_User");

            migrationBuilder.RenameIndex(
                name: "IX_Lotes_Id_Rancho",
                table: "Lote",
                newName: "IX_Lote_Id_User");

            migrationBuilder.AddColumn<string>(
                name: "Nombre",
                table: "Lote",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Lote",
                table: "Lote",
                column: "Id_Lote");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Lote_Id_Lote",
                table: "Animales",
                column: "Id_Lote",
                principalTable: "Lote",
                principalColumn: "Id_Lote",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lote_Users_Id_User",
                table: "Lote",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
