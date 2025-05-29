using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace MessageService.Services
{
    public class MatchService
    {
        private readonly HttpClient _httpClient;

        public MatchService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> CheckMatchAsync(int userId1, int userId2)
        {
            var response = await _httpClient.GetAsync($"https://localhost:5002/api/campaigns/validate-agreement-for-message?userId1={userId1}&userId2={userId2}");

            if (!response.IsSuccessStatusCode)
            {
                return false;
            }

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<MatchResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result.IsMatch;
        }

        private class MatchResponse
        {
            public bool IsMatch { get; set; }
        }
    }
}
