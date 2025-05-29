namespace InstagramService.Models
{
    public class InstagramUserUpdateDto
    {
        public int UserId { get; set; }
        public int FollowerCount { get; set; }
        public string? Category { get; set; }
        public double? EngagementRate { get; set; }
    }
}
