using System.Diagnostics;
using System.Text.Json;
using UserService.Models;

namespace UserService.Helpers
{
    public static class MlScoreHelper
    {
        public static double? CalculateScore(User user)
        {
            Console.WriteLine("➡️ Score hesaplama başlatıldı.");

            if (user.FollowerCount is null || user.FollowerCount == 0 ||
                user.AvgLikes == 0 || user.TotalLikes == 0)
            {
                Console.WriteLine("⛔ Gerekli veriler eksik: FollowerCount / AvgLikes / TotalLikes");
                return null;
            }

            var input = new
            {
                posts = user.Posts,
                followers = user.FollowerCount,
                avg_likes = user.AvgLikes,
                _60_day_eng_rate = user.Engagement60Day,
                new_post_avg_like = user.NewPostAvgLike,
                total_likes = user.TotalLikes
            };

            var json = JsonSerializer.Serialize(input);
            Console.WriteLine("📦 Gönderilen JSON: " + json);

            var psi = new ProcessStartInfo
            {
                FileName = @"C:\Users\Ahmet\AppData\Local\Programs\Python\Python310\python.exe",
                Arguments = $"predict_score.py \"{json.Replace("\"", "\\\"")}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            try
            {
                using var process = Process.Start(psi);
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                Console.WriteLine("✅ Python çıktı: " + output);
                if (!string.IsNullOrWhiteSpace(error))
                    Console.WriteLine("❌ Python HATA: " + error);

                if (double.TryParse(output, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var score))
                {
                    Console.WriteLine($"🎯 Hesaplanan skor: {score}");
                    return score;
                }
                else
                {
                    Console.WriteLine("⚠️ Skor parse edilemedi.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("🔥 Process hatası: " + ex.Message);
            }

            return null;
        }
    }
}
