using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace checkin.Migrations
{
    /// <inheritdoc />
    public partial class AtualizaCheckinComNovasColunas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Observacoes",
                table: "Checkins",
                newName: "TipoIngresso");

            migrationBuilder.RenameColumn(
                name: "Local",
                table: "Checkins",
                newName: "Email");

            migrationBuilder.AddColumn<string>(
                name: "Codigo",
                table: "Checkins",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Codigo",
                table: "Checkins");

            migrationBuilder.RenameColumn(
                name: "TipoIngresso",
                table: "Checkins",
                newName: "Observacoes");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Checkins",
                newName: "Local");
        }
    }
}
