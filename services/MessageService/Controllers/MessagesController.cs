using MessageService.Data;
using MessageService.Hubs;
using MessageService.Models;
using MessageService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MessageService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly MatchService _matchService;

        public MessagesController(AppDbContext context, IHubContext<ChatHub> hubContext, MatchService matchService)
        {
            _context = context;
            _hubContext = hubContext;
            _matchService = matchService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            var senderIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (senderIdFromToken != message.SenderId)
            {
                return Unauthorized("SenderId does not match the authenticated user.");
            }

            var isMatch = await _matchService.CheckMatchAsync(message.SenderId, message.ReceiverId);
            if (!isMatch)
            {
                return BadRequest("Users are not matched.");
            }

            message.SentAt = DateTime.UtcNow;
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            await _hubContext
                .Clients
                .User(message.ReceiverId.ToString())
                .SendAsync("ReceiveMessage", message.SenderId, message.Content, message.AgreementId);

            return Ok("Message sent successfully.");
        }


        [Authorize]
        [HttpGet("{userId}/agreement/{agreementId}")]
        public async Task<IActionResult> GetMessages(int userId, int agreementId)
        {
            var myId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var messages = await _context.Messages
                .Where(m =>
                    m.AgreementId == agreementId &&
                    (
                        (m.SenderId == myId && m.ReceiverId == userId) ||
                        (m.SenderId == userId && m.ReceiverId == myId)
                    )
                )
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }
    }
}
