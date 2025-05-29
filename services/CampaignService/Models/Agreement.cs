using CampaignService.Enums;

namespace CampaignService.Models
{
    public class Agreement
    {
        public int Id { get; set; }
        public int CampaignId { get; set; }
        public required Campaign Campaign { get; set; }
        public int ContentCreatorId { get; set; } 
        public int AdvertiserId { get; set; } 
        public required AgreementStatus Status { get; set; }
        public DateTime AgreementDate { get; set; }
    }
}
