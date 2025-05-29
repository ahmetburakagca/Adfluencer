using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaymentService.Interfaces;
using PaymentService.Models;

namespace PaymentService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }
       
        [HttpPost]
        public async Task<IActionResult> CreateCheckout([FromBody] PaymentRequestDto request)
        {
            var checkoutUrl = await _paymentService.CreateCheckoutSessionAsync(request);
            return Ok(new { url = checkoutUrl });
        }
    }
}
