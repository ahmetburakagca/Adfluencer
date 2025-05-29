using System.ComponentModel.DataAnnotations;
using UserService.Enums;

namespace UserService.Requests
{
    public class UserUpdateRequest
    {
        public string? Username { get; set; }
        public string? Email { get; set; }

        public UserRole? Role { get; set; }
        public int? FollowerCount { get; set; }
        public string? Category { get; set; }

        // Nullable yaptık
        public IFormFile? Photo { get; set; }
        public bool RemovePhoto { get; set; } = false;
        public int? Posts { get; set; }
        public int? AvgLikes { get; set; }
        public double? Engagement60Day { get; set; }
        public int? NewPostAvgLike { get; set; }
        public long? TotalLikes { get; set; }
    }
}
