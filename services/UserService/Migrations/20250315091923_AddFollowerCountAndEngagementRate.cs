using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserService.Migrations
{
    /// <inheritdoc />
    public partial class AddFollowerCountAndEngagementRate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "EngagementRate",
                table: "Users",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FollowerCount",
                table: "Users",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EngagementRate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FollowerCount",
                table: "Users");
        }
    }
}
