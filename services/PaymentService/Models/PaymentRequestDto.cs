namespace PaymentService.Models
{
    public class PaymentRequestDto
    {
        public int AgreementId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "usd";
        public string Description { get; set; } = string.Empty;
        public string SuccessUrl { get; set; } = string.Empty;//bizim frontend url adresi olacak
        public string CancelUrl { get; set; } = string.Empty;
    }
}
