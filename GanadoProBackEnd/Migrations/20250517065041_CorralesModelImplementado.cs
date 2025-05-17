using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class CorralesModelImplementado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Ranchos_Id_Rancho",
                table: "Lotes");

            migrationBuilder.RenameColumn(
                name: "Id_Rancho",
                table: "Lotes",
                newName: "Id_Corrales");

            migrationBuilder.RenameIndex(
                name: "IX_Lotes_Id_Rancho",
                table: "Lotes",
                newName: "IX_Lotes_Id_Corrales");

            migrationBuilder.CreateTable(
                name: "Corrales",
                columns: table => new
                {
                    Id_Corrales = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Id_Rancho = table.Column<int>(type: "int", nullable: false),
                    NombreCorral = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CapacidadMaxima = table.Column<int>(type: "int", nullable: false),
                    TipoGanado = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Estado = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Notas = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Corrales", x => x.Id_Corrales);
                    table.ForeignKey(
                        name: "FK_Corrales_Ranchos_Id_Rancho",
                        column: x => x.Id_Rancho,
                        principalTable: "Ranchos",
                        principalColumn: "Id_Rancho",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Corrales_Id_Rancho",
                table: "Corrales",
                column: "Id_Rancho");

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Corrales_Id_Corrales",
                table: "Lotes",
                column: "Id_Corrales",
                principalTable: "Corrales",
                principalColumn: "Id_Corrales",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Corrales_Id_Corrales",
                table: "Lotes");

            migrationBuilder.DropTable(
                name: "Corrales");

            migrationBuilder.RenameColumn(
                name: "Id_Corrales",
                table: "Lotes",
                newName: "Id_Rancho");

            migrationBuilder.RenameIndex(
                name: "IX_Lotes_Id_Corrales",
                table: "Lotes",
                newName: "IX_Lotes_Id_Rancho");

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Ranchos_Id_Rancho",
                table: "Lotes",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
