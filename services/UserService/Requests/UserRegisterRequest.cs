using System.ComponentModel.DataAnnotations;
using UserService.Enums;

namespace UserService.DTOs
{
    public class UserRegisterRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
        [Required]
        public UserRole Role { get; set; }
        public int? FollowerCount { get; set; }
        public string? Category { get; set; }
        public IFormFile Photo { get; set; }
    }
}
