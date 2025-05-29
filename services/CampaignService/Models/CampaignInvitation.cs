using CampaignService.Enums;

namespace CampaignService.Models
{
    public class CampaignInvitation
    {
        public int Id { get; set; }
        public required int CampaignId { get; set; }
        public required Campaign Campaign { get; set; }
        public required int ContentCreatorId { get; set; }
        public required InvitationStatus Status { get; set; }
    }
}
