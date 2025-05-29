using PaymentService.Interfaces;
using PaymentService.Models;

namespace PaymentService.Services
{
    public class CampaignServiceClient:ICampaignServiceClient 
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<CampaignServiceClient> _logger;

        public CampaignServiceClient(HttpClient httpClient, ILogger<CampaignServiceClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task NotifyPaymentCompletedAsync(int agreementId)
        {
            var request = new UpdateAgreementStatusRequest
            {
                Status = 1
            };

            var response = await _httpClient.PutAsJsonAsync($"api/campaigns/agreements/{agreementId}/payment", request);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"Failed to notify CampaignService for agreement {agreementId}");
            }
        }
    }
}
