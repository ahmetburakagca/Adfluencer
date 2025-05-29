using CampaignService.Enums;

namespace CampaignService.Requests
{
    public class CampaignCreateRequest
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required double Budget { get; set; }
        public CampaignStatus Status { get; set; }
        public required int MaxCapacity { get; set; }
    }
}
