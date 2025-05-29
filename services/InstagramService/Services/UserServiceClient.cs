using InstagramService.Interfaces;
using InstagramService.Models;

namespace InstagramService.Services
{
    public class UserServiceClient : IUserServiceClient
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public UserServiceClient(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<bool> UpdateInstagramInfoAsync(InstagramUserUpdateDto dto)
        {
            //böyle bir endpoint tanımla user serviste
            var url = $"{_config["UserServiceUrl"]}/api/users/update-instagram";
            var response = await _httpClient.PutAsJsonAsync(url, dto);
            return response.IsSuccessStatusCode;
        }
    }
}
