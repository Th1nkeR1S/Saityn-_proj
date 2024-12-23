using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiProjektas.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Topics_topicId",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "topicId",
                table: "Posts",
                newName: "TopicId");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_topicId",
                table: "Posts",
                newName: "IX_Posts_TopicId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Topics_TopicId",
                table: "Posts",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Topics_TopicId",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "TopicId",
                table: "Posts",
                newName: "topicId");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_TopicId",
                table: "Posts",
                newName: "IX_Posts_topicId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Topics_topicId",
                table: "Posts",
                column: "topicId",
                principalTable: "Topics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
