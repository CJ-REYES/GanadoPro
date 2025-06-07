using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GanadoProBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class BacKEndRestructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Corrales_CorralesId_Corrales",
                table: "Lotes");

            migrationBuilder.DropTable(
                name: "Corrales");

            migrationBuilder.DropTable(
                name: "LoteVenta");

            migrationBuilder.DropColumn(
                name: "Cliente",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "Rol",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Origen",
                table: "Animales");

            migrationBuilder.RenameColumn(
                name: "FechaVenta",
                table: "Ventas",
                newName: "FechaSalida");

            migrationBuilder.RenameColumn(
                name: "CorralesId_Corrales",
                table: "Lotes",
                newName: "Id_Cliente");

            migrationBuilder.RenameIndex(
                name: "IX_Lotes_CorralesId_Corrales",
                table: "Lotes",
                newName: "IX_Lotes_Id_Cliente");

            migrationBuilder.RenameColumn(
                name: "Fecha_Registro",
                table: "Animales",
                newName: "FechaRegistro");

            migrationBuilder.RenameColumn(
                name: "FechaCompra",
                table: "Animales",
                newName: "FechaSalida");

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Ventas",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FolioGuiaRemo",
                table: "Ventas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Id_Cliente",
                table: "Ventas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id_Productor",
                table: "Ventas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TipoVenta",
                table: "Ventas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(2025, 6, 7, 19, 12, 14, 534, DateTimeKind.Utc).AddTicks(1328),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Lotes",
                type: "longtext",
                nullable: false,
                defaultValue: "Disponible",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "Id_Rancho",
                table: "Animales",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Clasificacion",
                table: "Animales",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Arete",
                table: "Animales",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CertificadoZootanitario",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ContanciaGarrapaticida",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Animales",
                type: "longtext",
                nullable: false,
                defaultValue: "EnStock")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaIngreso",
                table: "Animales",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "FierroCliente",
                table: "Animales",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FoliGuiaRemoEntrada",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FoliGuiaRemoSalida",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FolioTB",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Id_Cliente",
                table: "Animales",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Id_Productor",
                table: "Animales",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MotivoSalida",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Observaciones",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RazonSocial",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "UppDestino",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "UppOrigen",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ValidacionConside_ID",
                table: "Animales",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Clientes",
                columns: table => new
                {
                    Id_Cliente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdFierros_Cliente = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Propietario = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Domicilio = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Localidad = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Municipio = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Entidad = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Upp = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clientes", x => x.Id_Cliente);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Fierros",
                columns: table => new
                {
                    Id_Fierro = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Fierro = table.Column<byte[]>(type: "longblob", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fierros", x => x.Id_Fierro);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Productores",
                columns: table => new
                {
                    Id_Productor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdFierros_Productores = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Propietario = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Domicilio = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Localidad = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Municipio = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Entidad = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Upp = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Productores", x => x.Id_Productor);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "VentaLotes",
                columns: table => new
                {
                    Id_Venta = table.Column<int>(type: "int", nullable: false),
                    Id_Lote = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VentaLotes", x => new { x.Id_Venta, x.Id_Lote });
                    table.ForeignKey(
                        name: "FK_VentaLotes_Lotes_Id_Lote",
                        column: x => x.Id_Lote,
                        principalTable: "Lotes",
                        principalColumn: "Id_Lote",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VentaLotes_Ventas_Id_Venta",
                        column: x => x.Id_Venta,
                        principalTable: "Ventas",
                        principalColumn: "Id_Venta",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "InventarioExportaciones",
                columns: table => new
                {
                    Id_InventarioExportacion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FechaSalida = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Id_Lote = table.Column<int>(type: "int", nullable: false),
                    Id_Productor = table.Column<int>(type: "int", nullable: false)
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
                name: "IX_Ventas_Id_Cliente",
                table: "Ventas",
                column: "Id_Cliente");

            migrationBuilder.CreateIndex(
                name: "IX_Ventas_Id_Productor",
                table: "Ventas",
                column: "Id_Productor");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_Id_Cliente",
                table: "Animales",
                column: "Id_Cliente");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_Id_Productor",
                table: "Animales",
                column: "Id_Productor");

            migrationBuilder.CreateIndex(
                name: "IX_InventarioExportaciones_Id_Lote",
                table: "InventarioExportaciones",
                column: "Id_Lote");

            migrationBuilder.CreateIndex(
                name: "IX_InventarioExportaciones_Id_Productor",
                table: "InventarioExportaciones",
                column: "Id_Productor");

            migrationBuilder.CreateIndex(
                name: "IX_VentaLotes_Id_Lote",
                table: "VentaLotes",
                column: "Id_Lote");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Clientes_Id_Cliente",
                table: "Animales",
                column: "Id_Cliente",
                principalTable: "Clientes",
                principalColumn: "Id_Cliente",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales",
                column: "Id_Lote",
                principalTable: "Lotes",
                principalColumn: "Id_Lote",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Productores_Id_Productor",
                table: "Animales",
                column: "Id_Productor",
                principalTable: "Productores",
                principalColumn: "Id_Productor",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Clientes_Id_Cliente",
                table: "Lotes",
                column: "Id_Cliente",
                principalTable: "Clientes",
                principalColumn: "Id_Cliente");

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Clientes_Id_Cliente",
                table: "Ventas",
                column: "Id_Cliente",
                principalTable: "Clientes",
                principalColumn: "Id_Cliente",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventas_Productores_Id_Productor",
                table: "Ventas",
                column: "Id_Productor",
                principalTable: "Productores",
                principalColumn: "Id_Productor",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Clientes_Id_Cliente",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Productores_Id_Productor",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Clientes_Id_Cliente",
                table: "Lotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Clientes_Id_Cliente",
                table: "Ventas");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventas_Productores_Id_Productor",
                table: "Ventas");

            migrationBuilder.DropTable(
                name: "Clientes");

            migrationBuilder.DropTable(
                name: "Fierros");

            migrationBuilder.DropTable(
                name: "InventarioExportaciones");

            migrationBuilder.DropTable(
                name: "VentaLotes");

            migrationBuilder.DropTable(
                name: "Productores");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_Id_Cliente",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Ventas_Id_Productor",
                table: "Ventas");

            migrationBuilder.DropIndex(
                name: "IX_Animales_Id_Cliente",
                table: "Animales");

            migrationBuilder.DropIndex(
                name: "IX_Animales_Id_Productor",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "FolioGuiaRemo",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "Id_Cliente",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "Id_Productor",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "TipoVenta",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "CertificadoZootanitario",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "ContanciaGarrapaticida",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "FechaIngreso",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "FierroCliente",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "FoliGuiaRemoEntrada",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "FoliGuiaRemoSalida",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "FolioTB",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Id_Cliente",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Id_Productor",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "MotivoSalida",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Observaciones",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "RazonSocial",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "UppDestino",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "UppOrigen",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "ValidacionConside_ID",
                table: "Animales");

            migrationBuilder.RenameColumn(
                name: "FechaSalida",
                table: "Ventas",
                newName: "FechaVenta");

            migrationBuilder.RenameColumn(
                name: "Id_Cliente",
                table: "Lotes",
                newName: "CorralesId_Corrales");

            migrationBuilder.RenameIndex(
                name: "IX_Lotes_Id_Cliente",
                table: "Lotes",
                newName: "IX_Lotes_CorralesId_Corrales");

            migrationBuilder.RenameColumn(
                name: "FechaSalida",
                table: "Animales",
                newName: "FechaCompra");

            migrationBuilder.RenameColumn(
                name: "FechaRegistro",
                table: "Animales",
                newName: "Fecha_Registro");

            migrationBuilder.UpdateData(
                table: "Ventas",
                keyColumn: "Estado",
                keyValue: null,
                column: "Estado",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Ventas",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Cliente",
                table: "Ventas",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Rol",
                table: "Users",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha_Creacion",
                table: "Lotes",
                type: "datetime(6)",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValue: new DateTime(2025, 6, 7, 19, 12, 14, 534, DateTimeKind.Utc).AddTicks(1328));

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Lotes",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldDefaultValue: "Disponible")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "Id_Rancho",
                table: "Animales",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Animales",
                keyColumn: "Clasificacion",
                keyValue: null,
                column: "Clasificacion",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Clasificacion",
                table: "Animales",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "Arete",
                table: "Animales",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Animales",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Origen",
                table: "Animales",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Corrales",
                columns: table => new
                {
                    Id_Corrales = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RanchoId_Rancho = table.Column<int>(type: "int", nullable: false),
                    CapacidadMaxima = table.Column<int>(type: "int", nullable: false),
                    Estado = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Id_Rancho = table.Column<int>(type: "int", nullable: false),
                    NombreCorral = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Notas = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TipoGanado = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Corrales", x => x.Id_Corrales);
                    table.ForeignKey(
                        name: "FK_Corrales_Ranchos_RanchoId_Rancho",
                        column: x => x.RanchoId_Rancho,
                        principalTable: "Ranchos",
                        principalColumn: "Id_Rancho",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LoteVenta",
                columns: table => new
                {
                    LotesId_Lote = table.Column<int>(type: "int", nullable: false),
                    VentasId_Venta = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoteVenta", x => new { x.LotesId_Lote, x.VentasId_Venta });
                    table.ForeignKey(
                        name: "FK_LoteVenta_Lotes_LotesId_Lote",
                        column: x => x.LotesId_Lote,
                        principalTable: "Lotes",
                        principalColumn: "Id_Lote",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LoteVenta_Ventas_VentasId_Venta",
                        column: x => x.VentasId_Venta,
                        principalTable: "Ventas",
                        principalColumn: "Id_Venta",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Corrales_RanchoId_Rancho",
                table: "Corrales",
                column: "RanchoId_Rancho");

            migrationBuilder.CreateIndex(
                name: "IX_LoteVenta_VentasId_Venta",
                table: "LoteVenta",
                column: "VentasId_Venta");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Lotes_Id_Lote",
                table: "Animales",
                column: "Id_Lote",
                principalTable: "Lotes",
                principalColumn: "Id_Lote");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Ranchos_Id_Rancho",
                table: "Animales",
                column: "Id_Rancho",
                principalTable: "Ranchos",
                principalColumn: "Id_Rancho",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Corrales_CorralesId_Corrales",
                table: "Lotes",
                column: "CorralesId_Corrales",
                principalTable: "Corrales",
                principalColumn: "Id_Corrales");
        }
    }
}
