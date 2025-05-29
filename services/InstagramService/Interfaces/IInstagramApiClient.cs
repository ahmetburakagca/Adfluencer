using InstagramService.Models;

namespace InstagramService.Interfaces
{
    public interface IInstagramApiClient
    {
        Task<string> ExchangeCodeForAccessTokenAsync(string code);
        Task<string> GetPageAccessTokenAsync(string userAccessToken);
        Task<string> GetInstagramBusinessAccountIdAsync(string pageAccessToken);
        Task<InstagramProfile?> GetInstagramProfileAsync(string igUserId, string pageAccessToken);
    }
}
