using CampaignService.Enums;

namespace CampaignService.Models
{
    public class Application
    {
        public int Id { get; set; }
        public required int CampaignId { get; set; }
        public required Campaign Campaign { get; set; }
        public required int ContentCreatorId { get; set; }
        public required ApplicationStatus Status { get; set; }
        public DateTime ApplicationDate { get; set; }

    }
}
