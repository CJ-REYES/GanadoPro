using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class VentasNew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Ranchos_Id_Rancho",
                table: "Lotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Ranchos_Id_Rancho",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_Id_Rancho",
                table: "Ventas");

            migrationBuilder.AddColumn<int>(
                name: "RanchoOrigenId_Rancho",
                table: "Ventas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UPP",
                table: "Ventas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "Id_Rancho",
                table: "Lotes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 6, 20, 22, 45, 27, 243, DateTimeKind.Utc).AddTicks(6473),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 6, 13, 20, 24, 47, 539, DateTimeKind.Utc).AddTicks(5632));

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_RanchoOrigenId_Rancho",
                table: "Ventas",
                column: "RanchoOrigenId_Rancho");

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Ranchos_Id_Rancho",
                table: "Lotes",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho");

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Ranchos_RanchoOrigenId_Rancho",
                table: "Ventas",
                column: "RanchoOrigenId_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Ranchos_Id_Rancho",
                table: "Lotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Ranchos_RanchoOrigenId_Rancho",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_RanchoOrigenId_Rancho",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "RanchoOrigenId_Rancho",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "UPP",
                table: "Ventas");

            migrationBuilder.AlterColumn<int>(
                name: "Id_Rancho",
                table: "Lotes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 6, 13, 20, 24, 47, 539, DateTimeKind.Utc).AddTicks(5632),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 6, 20, 22, 45, 27, 243, DateTimeKind.Utc).AddTicks(6473));

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_Id_Rancho",
                table: "Ventas",
                column: "Id_Rancho");

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Users_Id_User",
                table: "Clientes",
                column: "Id_User",
                principalTable: "Users",
                principalColumn: "Id_User");

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Ranchos_Id_Rancho",
                table: "Lotes",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Ranchos_Id_Rancho",
                table: "Ventas",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
