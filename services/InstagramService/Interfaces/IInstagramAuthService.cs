namespace InstagramService.Interfaces
{
    public interface IInstagramAuthService
    {
        string GenerateLoginUrl();
        Task<bool> HandleCallbackAsync(string code, int userId);
    }
}
