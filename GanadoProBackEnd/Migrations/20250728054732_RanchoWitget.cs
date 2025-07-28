using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class RanchoWitget : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales");

            migrationBuilder.AlterColumn<DateTime>(
                name: "FechaSalida",
                table: "Ventas",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AddColumn<int>(
                name: "Id_Animal",
                table: "Ranchos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 7, 28, 5, 47, 31, 932, DateTimeKind.Utc).AddTicks(2814),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 6, 20, 22, 45, 27, 243, DateTimeKind.Utc).AddTicks(6473));

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Id_Animal",
                table: "Ranchos");

            migrationBuilder.AlterColumn<DateTime>(
                name: "FechaSalida",
                table: "Ventas",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 6, 20, 22, 45, 27, 243, DateTimeKind.Utc).AddTicks(6473),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 7, 28, 5, 47, 31, 932, DateTimeKind.Utc).AddTicks(2814));

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
