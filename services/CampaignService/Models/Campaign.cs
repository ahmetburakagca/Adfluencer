using CampaignService.Enums;

namespace CampaignService.Models
{
    public class Campaign
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public double? Budget { get; set; }
        public required CampaignStatus Status { get; set; }
        public int? MaxCapacity { get; set; }
        public required int AdvertiserId { get; set; }
        public ICollection<CampaignInvitation>? Invitations { get; set; }
        public ICollection<Application>? Applications { get; set; }

        

    }
}
