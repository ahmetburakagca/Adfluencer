using UserService.Enums;

namespace UserService.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public UserRole Role { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }

        public string? Category { get; set; }
        public string? Photo { get; set; }
        public double? Score { get; set; }
        public int? FollowerCount { get; set; }

        // Ek olarak göstermek istediğin alanları buraya ekleyebilirsin.
    }
}
