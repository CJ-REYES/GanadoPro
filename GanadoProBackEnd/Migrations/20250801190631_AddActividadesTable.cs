using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddActividadesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 8, 1, 19, 6, 30, 325, DateTimeKind.Utc).AddTicks(6921),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 7, 28, 5, 47, 31, 932, DateTimeKind.Utc).AddTicks(2814));

            migrationBuilder.CreateTable(
                name: "Actividades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Tipo = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Descripcion = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Tiempo = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Estado = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Accion = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UsuarioId = table.Column<int>(type: "int", nullable: true),
                    EntidadId = table.Column<int>(type: "int", nullable: true),
                    TipoEntidad = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actividades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Actividades_Users_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Users",
                        principalColumn: "Id_User");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Actividades_UsuarioId",
                table: "Actividades",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Actividades");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 7, 28, 5, 47, 31, 932, DateTimeKind.Utc).AddTicks(2814),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 8, 1, 19, 6, 30, 325, DateTimeKind.Utc).AddTicks(6921));
        }
    }
}
