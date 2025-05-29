using PaymentService.Interfaces;
using PaymentService.Models;
using Stripe.Checkout;
using Stripe;

namespace PaymentService.Services
{

    public class StripePaymentService : IPaymentService
    {
        public StripePaymentService(IConfiguration configuration)
        {
            StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];
        }

        public async Task<string> CreateCheckoutSessionAsync(PaymentRequestDto request)
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = request.Currency,
                            UnitAmount = (long)(request.Amount * 100), // Stripe cent cinsinden istiyor
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.Description
                            }
                        },
                        Quantity = 1
                    }
                },
                Mode = "payment",
                SuccessUrl = request.SuccessUrl,
                CancelUrl = request.CancelUrl,
                Metadata = new Dictionary<string, string>
                {
                    { "agreementId", request.AgreementId.ToString() }
                }
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);
            return session.Url!;
        }
    }
}
