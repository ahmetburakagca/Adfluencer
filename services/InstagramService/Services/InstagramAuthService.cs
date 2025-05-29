using InstagramService.Interfaces;
using InstagramService.Models;

namespace InstagramService.Services
{

    public class InstagramAuthService : IInstagramAuthService
    {
        private readonly IInstagramApiClient _instagramApiClient;
        private readonly IUserServiceClient _userServiceClient;
        private readonly IConfiguration _config;

        public InstagramAuthService(IInstagramApiClient instagramApiClient, IUserServiceClient userServiceClient,IConfiguration config)
        {
            _instagramApiClient = instagramApiClient;
            _userServiceClient = userServiceClient;
            _config=config;
        }

        public string GenerateLoginUrl()
        {
            var clientId = _config["Meta:ClientId"];
            var redirectUri = _config["Meta:RedirectUri"];
            var scope = "pages_show_list,instagram_basic";

            return $"https://www.facebook.com/v19.0/dialog/oauth?client_id={clientId}&redirect_uri={redirectUri}&scope={scope}&response_type=code";
        }

        public async Task<bool> HandleCallbackAsync(string code, int userId)
        {
            try
            {
                var userAccessToken = await _instagramApiClient.ExchangeCodeForAccessTokenAsync(code);
                var pageAccessToken = await _instagramApiClient.GetPageAccessTokenAsync(userAccessToken);
                var igUserId = await _instagramApiClient.GetInstagramBusinessAccountIdAsync(pageAccessToken);
                var profile = await _instagramApiClient.GetInstagramProfileAsync(igUserId, pageAccessToken);

                if (profile == null) return false;
                //dto bakılacak doğru mu
                var dto = new InstagramUserUpdateDto
                {
                    UserId = userId,
                    FollowerCount = profile.followers_count,
                    Category = null, // Opsiyonel
                    EngagementRate = null // Opsiyonel
                };

                return await _userServiceClient.UpdateInstagramInfoAsync(dto);
            }
            catch (Exception ex)
            {
                Console.WriteLine("[InstagramAuthService] Error: " + ex.Message);
                return false;
            }
        }
    }
}
