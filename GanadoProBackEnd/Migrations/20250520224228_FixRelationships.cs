using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class FixRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Corrales_Ranchos_Id_Rancho",
                table: "Corrales");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Corrales_Id_Corrales",
                table: "Lotes");

            migrationBuilder.DropIndex(
                name: "IX_Corrales_Id_Rancho",
                table: "Corrales");

            migrationBuilder.DropIndex(
                name: "IX_Animales_Id_Lote",
                table: "Animales");

            migrationBuilder.RenameColumn(
                name: "FechaProgramada",
                table: "Ventas",
                newName: "FechaVenta");

            migrationBuilder.RenameColumn(
                name: "CorreoElectronico",
                table: "Ranchos",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "ObservacionesVenta",
                table: "Lotes",
                newName: "Observaciones");

            migrationBuilder.RenameColumn(
                name: "Id_Corrales",
                table: "Lotes",
                newName: "Id_Rancho");

            migrationBuilder.RenameIndex(
                name: "IX_Lotes_Id_Corrales",
                table: "Lotes",
                newName: "IX_Lotes_Id_Rancho");

            migrationBuilder.AddColumn<int>(
                name: "Id_Rancho",
                table: "Ventas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Users",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "CorralesId_Corrales",
                table: "Lotes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "RanchoId_Rancho",
                table: "Corrales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "Id_Lote",
                table: "Animales",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Id_Rancho",
                table: "Animales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LoteId_Lote",
                table: "Animales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_Id_Rancho",
                table: "Ventas",
                column: "Id_Rancho");

            migrationBuilder.CreateIndex(
                name: "IX_Lotes_CorralesId_Corrales",
                table: "Lotes",
                column: "CorralesId_Corrales");

            migrationBuilder.CreateIndex(
                name: "IX_Corrales_RanchoId_Rancho",
                table: "Corrales",
                column: "RanchoId_Rancho");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_Id_Rancho",
                table: "Animales",
                column: "Id_Rancho");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_LoteId_Lote",
                table: "Animales",
                column: "LoteId_Lote");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Lotes_LoteId_Lote",
                table: "Animales",
                column: "LoteId_Lote",
                principalTable: "Lotes",
                principalColumn: "Id_Lote",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Corrales_Ranchos_RanchoId_Rancho",
                table: "Corrales",
                column: "RanchoId_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Corrales_CorralesId_Corrales",
                table: "Lotes",
                column: "CorralesId_Corrales",
                principalTable: "Corrales",
                principalColumn: "Id_Corrales");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Lotes_LoteId_Lote",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Corrales_Ranchos_RanchoId_Rancho",
                table: "Corrales");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Corrales_CorralesId_Corrales",
                table: "Lotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Ranchos_Id_Rancho",
                table: "Lotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Ranchos_Id_Rancho",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_Id_Rancho",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Lotes_CorralesId_Corrales",
                table: "Lotes");

            migrationBuilder.DropIndex(
                name: "IX_Corrales_RanchoId_Rancho",
                table: "Corrales");

            migrationBuilder.DropIndex(
                name: "IX_Animales_Id_Rancho",
                table: "Animales");

            migrationBuilder.DropIndex(
                name: "IX_Animales_LoteId_Lote",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Id_Rancho",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CorralesId_Corrales",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "Fecha_Creacion",
                table: "Lotes");

            migrationBuilder.DropColumn(
                name: "RanchoId_Rancho",
                table: "Corrales");

            migrationBuilder.DropColumn(
                name: "Id_Rancho",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "LoteId_Lote",
                table: "Animales");

            migrationBuilder.RenameColumn(
                name: "FechaVenta",
                table: "Ventas",
                newName: "FechaProgramada");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Ranchos",
                newName: "CorreoElectronico");

            migrationBuilder.RenameColumn(
                name: "Observaciones",
                table: "Lotes",
                newName: "ObservacionesVenta");

            migrationBuilder.RenameColumn(
                name: "Id_Rancho",
                table: "Lotes",
                newName: "Id_Corrales");

            migrationBuilder.RenameIndex(
                name: "IX_Lotes_Id_Rancho",
                table: "Lotes",
                newName: "IX_Lotes_Id_Corrales");

            migrationBuilder.AlterColumn<int>(
                name: "Id_Lote",
                table: "Animales",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Corrales_Id_Rancho",
                table: "Corrales",
                column: "Id_Rancho");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_Id_Lote",
                table: "Animales",
                column: "Id_Lote");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales",
                column: "Id_Lote",
                principalTable: "Lotes",
                principalColumn: "Id_Lote",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Corrales_Ranchos_Id_Rancho",
                table: "Corrales",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Corrales_Id_Corrales",
                table: "Lotes",
                column: "Id_Corrales",
                principalTable: "Corrales",
                principalColumn: "Id_Corrales",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
