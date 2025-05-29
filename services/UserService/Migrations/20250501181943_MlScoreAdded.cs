using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserService.Migrations
{
    /// <inheritdoc />
    public partial class MlScoreAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EngagementRate",
                table: "Users",
                newName: "Engagement60Day");

            migrationBuilder.AddColumn<int>(
                name: "AvgLikes",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NewPostAvgLike",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Posts",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Score",
                table: "Users",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<long>(
                name: "TotalLikes",
                table: "Users",
                type: "bigint",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvgLikes",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NewPostAvgLike",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Posts",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TotalLikes",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Engagement60Day",
                table: "Users",
                newName: "EngagementRate");
        }
    }
}
