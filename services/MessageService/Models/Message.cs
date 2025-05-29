namespace MessageService.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public required string Content { get; set; }
        public int AgreementId {  get; set; }
        public DateTime SentAt { get; set; } 
    }
}
