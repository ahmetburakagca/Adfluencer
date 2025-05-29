using Microsoft.AspNetCore.Mvc;
using PaymentService.Services;
using PaymentService.Interfaces;

using Stripe;
using Stripe.Forwarding;
using Stripe.Checkout;

namespace PaymentService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebhookController : ControllerBase
    {
        private readonly ICampaignServiceClient _campaignServiceClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<WebhookController> _logger;

        public WebhookController(ICampaignServiceClient campaignServiceClient, IConfiguration configuration, ILogger<WebhookController> logger)
        {
            _campaignServiceClient = campaignServiceClient;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var secret = _configuration["Stripe:WebhookSecret"]; // test keyini buraya ekle

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    secret
                );

                if (stripeEvent.Type == "checkout.session.completed")
                {
                    var session = stripeEvent.Data.Object as Session;
                    var agreementIdStr = session?.Metadata["agreementId"];
                    Console.WriteLine(agreementIdStr);

                    if (int.TryParse(agreementIdStr, out var agreementId))
                    {
                        await _campaignServiceClient.NotifyPaymentCompletedAsync(agreementId);
                    }
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Webhook processing failed");
                return BadRequest();
            }
        }
    }
}
