using MessageService.Data;
using MessageService.Models;
using MessageService.Services;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace MessageService.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string senderId, string receiverId, string message)
        {
            await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                Console.WriteLine($"User {userId} connected with connection {Context.ConnectionId}");
            }

            await base.OnConnectedAsync();
        }

        public class NameIdentifierUserIdProvider : IUserIdProvider
        {
            public string GetUserId(HubConnectionContext connection)
            {
                return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
        }

    }
}
