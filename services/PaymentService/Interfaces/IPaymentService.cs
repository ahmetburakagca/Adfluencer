using PaymentService.Models;

namespace PaymentService.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreateCheckoutSessionAsync(PaymentRequestDto request);
    }
}
