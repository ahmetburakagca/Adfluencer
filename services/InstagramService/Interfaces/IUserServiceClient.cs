using InstagramService.Models;

namespace InstagramService.Interfaces
{
    public interface IUserServiceClient
    {
        Task<bool> UpdateInstagramInfoAsync(InstagramUserUpdateDto dto);
    }
}
