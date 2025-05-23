using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class Restructured : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Lotes_LoteId_Lote",
                table: "Animales");

            migrationBuilder.DropIndex(
                name: "IX_Animales_LoteId_Lote",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "LoteId_Lote",
                table: "Animales");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_Id_Lote",
                table: "Animales",
                column: "Id_Lote");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales",
                column: "Id_Lote",
                principalTable: "Lotes",
                principalColumn: "Id_Lote");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales");

            migrationBuilder.DropIndex(
                name: "IX_Animales_Id_Lote",
                table: "Animales");

            migrationBuilder.AddColumn<int>(
                name: "LoteId_Lote",
                table: "Animales",
                type: "int",
                nullable: false,
                defaultValue: 0);

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
        }
    }
}
