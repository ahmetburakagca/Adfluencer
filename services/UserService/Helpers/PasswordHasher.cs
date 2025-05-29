using System.Security.Cryptography;
using System.Text;

namespace UserService.Helpers
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password, string salt)
        {
            using (var sha512 = SHA512.Create())
            {
                var saltedPassword = password + salt;
                var hashedBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        public static string GenerateSalt()
        {
            var randomBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }
    }
}
