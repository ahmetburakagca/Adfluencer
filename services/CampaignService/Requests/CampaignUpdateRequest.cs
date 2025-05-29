using CampaignService.Enums;

namespace CampaignService.Requests
{
    public class CampaignUpdateRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public double? Budget { get; set; }
        public int? Status { get; set; }
        public int? MaxCapacity { get; set; }
    }
}
