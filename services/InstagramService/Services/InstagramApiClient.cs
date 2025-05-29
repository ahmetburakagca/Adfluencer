using InstagramService.Interfaces;
using InstagramService.Models;
using System.Text.Json;

namespace InstagramService.Services
{
    public class InstagramApiClient : IInstagramApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public InstagramApiClient(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<string> ExchangeCodeForAccessTokenAsync(string code)
        {
            var clientId = _config["Meta:ClientId"];
            var clientSecret = _config["Meta:ClientSecret"];
            var redirectUri = _config["Meta:RedirectUri"];

            var tokenUrl = $"https://graph.facebook.com/v19.0/oauth/access_token?client_id={clientId}&redirect_uri={redirectUri}&client_secret={clientSecret}&code={code}";
            var response = await _httpClient.GetFromJsonAsync<FacebookTokenResponse>(tokenUrl);
            return response?.access_token ?? throw new Exception("Token alınamadı");
        }

        public async Task<string> GetPageAccessTokenAsync(string userAccessToken)
        {
            var url = $"https://graph.facebook.com/v19.0/me/accounts?access_token={userAccessToken}";
            var response = await _httpClient.GetAsync(url);
            var jsonString = await response.Content.ReadAsStringAsync();

            Console.WriteLine("Facebook me/accounts response: " + jsonString);

            var jsonDoc = JsonDocument.Parse(jsonString);
            var root = jsonDoc.RootElement;

            if (!root.TryGetProperty("data", out var dataElement) || dataElement.GetArrayLength() == 0)
                throw new Exception("No Facebook pages connected or insufficient permissions.");

            var pageAccessToken = dataElement[0].GetProperty("access_token").GetString();

            return pageAccessToken!;
        }

        public async Task<string> GetInstagramBusinessAccountIdAsync(string pageAccessToken)
        {
            var url = $"https://graph.facebook.com/v19.0/me/accounts?access_token={pageAccessToken}";
            var result = await _httpClient.GetFromJsonAsync<dynamic>(url);
            return result.data[0].instagram_business_account.id;
        }

        public async Task<InstagramProfile?> GetInstagramProfileAsync(string igUserId, string pageAccessToken)
        {
            var url = $"https://graph.facebook.com/v19.0/{igUserId}?fields=username,followers_count,media_count&access_token={pageAccessToken}";
            return await _httpClient.GetFromJsonAsync<InstagramProfile>(url);
        }
    }
}
