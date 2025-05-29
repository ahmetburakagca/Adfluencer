namespace PaymentService.Interfaces
{
    public interface ICampaignServiceClient
    {
        Task NotifyPaymentCompletedAsync(int agreementId);
    }
}
