using UserService.Enums;

namespace UserService.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string Salt { get; set; }
        public required UserRole Role { get; set; }
        public int? FollowerCount { get; set; }
        public string? Category { get; set; }
        public string? PhotoUrl { get; set; }
        public string? PhotoPublicId { get; set; }
        public double Score { get; set; }
        public int? Posts { get; set; }
        public int? AvgLikes { get; set; }
        public double? Engagement60Day { get; set; }
        public int? NewPostAvgLike { get; set; }
        public long? TotalLikes { get; set; }
    }
}
