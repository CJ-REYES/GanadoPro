using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class UserRelacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ranchos_Users_Id_User",
                table: "Ranchos");

            migrationBuilder.DropForeignKey(
                name: "FK_VentaLotes_Lotes_Id_Lote",
                table: "VentaLotes");

            migrationBuilder.DropForeignKey(
                name: "FK_VentaLotes_Ventas_Id_Venta",
                table: "VentaLotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Productores_Id_Productor",
                table: "Ventas");

            migrationBuilder.DropTable(
                name: "InventarioExportaciones");

            migrationBuilder.AddColumn<int>(
                name: "Id_User",
                table: "Ventas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id_User",
                table: "Productores",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 6, 8, 6, 20, 47, 954, DateTimeKind.Utc).AddTicks(7082),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 6, 7, 19, 12, 14, 534, DateTimeKind.Utc).AddTicks(1328));

            migrationBuilder.AddColumn<int>(
                name: "Id_User",
                table: "Lotes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id_User",
                table: "Clientes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id_User",
                table: "Animales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_Id_User",
                table: "Ventas",
                column: "Id_User");

            migrationBuilder.CreateIndex(
                name: "IX_Productores_Id_User",
                table: "Productores",
                column: "Id_User");

            migrationBuilder.CreateIndex(
                name: "IX_Lotes_Id_User",
                table: "Lotes",
                column: "Id_User");

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_Id_User",
                table: "Clientes",
                column: "Id_User");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_Id_User",
                table: "Animales",
                column: "Id_User");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Users_Id_User",
                table: "Animales",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Users_Id_User",
                table: "Lotes",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Productores_Users_Id_User",
                table: "Productores",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Ranchos_Users_Id_User",
                table: "Ranchos",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VentaLotes_Lotes_Id_Lote",
                table: "VentaLotes",
                column: "Id_Lote",
                principalTable: "Lotes",
                principalColumn: "Id_Lote",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VentaLotes_Ventas_Id_Venta",
                table: "VentaLotes",
                column: "Id_Venta",
                principalTable: "Ventas",
                principalColumn: "Id_Venta",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Productores_Id_Productor",
                table: "Ventas",
                column: "Id_Productor",
                principalTable: "Productores",
                principalColumn: "Id_Productor",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Users_Id_User",
                table: "Ventas",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Users_Id_User",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Users_Id_User",
                table: "Lotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Productores_Users_Id_User",
                table: "Productores");

            migrationBuilder.DropForeignKey(
                name: "FK_Ranchos_Users_Id_User",
                table: "Ranchos");

            migrationBuilder.DropForeignKey(
                name: "FK_VentaLotes_Lotes_Id_Lote",
                table: "VentaLotes");

            migrationBuilder.DropForeignKey(
                name: "FK_VentaLotes_Ventas_Id_Venta",
                table: "VentaLotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Productores_Id_Productor",
                table: "Ventas");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Users_Id_User",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_Id_User",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Productores_Id_User",
                table: "Productores");

            migrationBuilder.DropIndex(
                name: "IX_Lotes_Id_User",
                table: "Lotes");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_Id_User",
                table: "Clientes");

            migrationBuilder.DropIndex(
                name: "IX_Animales_Id_User",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Id_User",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "Id_User",
                table: "Productores");

            migrationBuilder.DropColumn(
                name: "Id_User",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "Id_User",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Id_User",
                table: "Animales");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 6, 7, 19, 12, 14, 534, DateTimeKind.Utc).AddTicks(1328),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 6, 8, 6, 20, 47, 954, DateTimeKind.Utc).AddTicks(7082));

            migrationBuilder.CreateTable(
                name: "InventarioExportaciones",
                columns: table => new
                {
                    Id_InventarioExportacion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Id_Lote = table.Column<int>(type: "int", nullable: false),
                    Id_Productor = table.Column<int>(type: "int", nullable: false),
                    FechaSalida = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventarioExportaciones", x => x.Id_InventarioExportacion);
                    table.ForeignKey(
                        name: "FK_InventarioExportaciones_Lotes_Id_Lote",
                        column: x => x.Id_Lote,
                        principalTable: "Lotes",
                        principalColumn: "Id_Lote",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InventarioExportaciones_Productores_Id_Productor",
                        column: x => x.Id_Productor,
                        principalTable: "Productores",
                        principalColumn: "Id_Productor",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_InventarioExportaciones_Id_Lote",
                table: "InventarioExportaciones",
                column: "Id_Lote");

            migrationBuilder.CreateIndex(
                name: "IX_InventarioExportaciones_Id_Productor",
                table: "InventarioExportaciones",
                column: "Id_Productor");

            migrationBuilder.AddForeignKey(
                name: "FK_Ranchos_Users_Id_User",
                table: "Ranchos",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VentaLotes_Lotes_Id_Lote",
                table: "VentaLotes",
                column: "Id_Lote",
                principalTable: "Lotes",
                principalColumn: "Id_Lote",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VentaLotes_Ventas_Id_Venta",
                table: "VentaLotes",
                column: "Id_Venta",
                principalTable: "Ventas",
                principalColumn: "Id_Venta",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Productores_Id_Productor",
                table: "Ventas",
                column: "Id_Productor",
                principalTable: "Productores",
                principalColumn: "Id_Productor",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
