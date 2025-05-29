using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UserService.Data;
using UserService.Models;
using UserService.Requests;
using UserService.Services;
using UserService.Enums;
using UserService.Helpers;
using UserService.Dtos;

namespace UserService.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PhotoService _photoService;

        public UsersController(AppDbContext context, PhotoService photoService)
        {
            _context = context;
            _photoService = photoService;
        }
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var currentUser = await _context.Users.FindAsync(userId);
            if (currentUser == null)
            {
                return NotFound();
            }
            var userResponse = new
            {
                currentUser.Id,
                currentUser.Username,
                currentUser.Email,
                currentUser.Role,
                FollowerCount = currentUser.Role == UserRole.ContentCreator ? currentUser.FollowerCount : (int?)null,
                Category = currentUser.Role == UserRole.ContentCreator ? currentUser.Category : (string?)null,
                Score = currentUser.Role == UserRole.ContentCreator ? currentUser.Score : (double?)null,
                currentUser.PhotoUrl
            };
            return Ok(userResponse);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var userResponse = new
            {
                user.Id,
                user.Username,
                user.Email,
                user.Role,
                FollowerCount = user.Role == UserRole.ContentCreator ? user.FollowerCount : (int?)null,
                Category = user.Role == UserRole.ContentCreator ? user.Category : (string?)null,
                Score = user.Role == UserRole.ContentCreator ? user.Score : (double?)null,
                Photo=user.PhotoUrl
            };

            return Ok(userResponse);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userId != id) return Forbid();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (request.RemovePhoto && !string.IsNullOrEmpty(user.PhotoPublicId))
            {
                await _photoService.DeletePhotoAsync(user.PhotoPublicId);
                user.PhotoUrl = null;
                user.PhotoPublicId = null;
            }

            if (request.Photo != null)
            {
                if (!string.IsNullOrEmpty(user.PhotoPublicId))
                {
                    await _photoService.DeletePhotoAsync(user.PhotoPublicId);
                }

                var uploadResult = await _photoService.AddPhotoAsync(request.Photo);
                if (uploadResult.Error != null)
                    return BadRequest("Photo upload failed.");

                user.PhotoUrl = uploadResult.SecureUrl.AbsoluteUri;
                user.PhotoPublicId = uploadResult.PublicId;
            }

            // 🧠 Sadece gelen değer varsa güncelle
            if (!string.IsNullOrEmpty(request.Username))
                user.Username = request.Username;

            if (!string.IsNullOrEmpty(request.Email))
                user.Email = request.Email;

            if (!string.IsNullOrEmpty(request.Category))
                user.Category = request.Category;

            if (request.Role != null)
                user.Role = request.Role.Value;

            if (request.FollowerCount.HasValue)
                user.FollowerCount = request.FollowerCount;

            if (request.Posts.HasValue)
                user.Posts = request.Posts;

            if (request.AvgLikes.HasValue)
                user.AvgLikes = request.AvgLikes;

            if (request.Engagement60Day.HasValue)
                user.Engagement60Day = request.Engagement60Day;

            if (request.NewPostAvgLike.HasValue)
                user.NewPostAvgLike = request.NewPostAvgLike;

            if (request.TotalLikes.HasValue)
                user.TotalLikes = request.TotalLikes;

            var score = MlScoreHelper.CalculateScore(user);
            if (score.HasValue)
            {
                user.Score = score.Value;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpGet("contentcreators")]
        public async Task<IActionResult> GetContentCreators()
        {
            var contentCreators = await _context.Users
                .Where(u => u.Role == UserRole.ContentCreator)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    Username=u.Username,
                    Category=u.Category,
                    Role = u.Role,
                    Score=u.Score,
                    Photo=u.PhotoUrl,
                    FollowerCount=u.FollowerCount
                })
                .ToListAsync();

            return Ok(ResponseDto<List<UserDto>>.SuccessResponse(contentCreators, "İçerik üreticileri listelendi.", 200));
        }

        [HttpGet("advertisers")]
        public async Task<IActionResult> GetAdvertisers()
        {
            var contentCreators = await _context.Users
                .Where(u => u.Role == UserRole.Advertiser)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    Username = u.Username,
                    Category = u.Category,
                    Role = u.Role,
                    Photo = u.PhotoUrl,
                })
                .ToListAsync();

            return Ok(ResponseDto<List<UserDto>>.SuccessResponse(contentCreators, "Reklamverenler listelendi.", 200));
        }
        [HttpPost("multiple")]
        public async Task<IActionResult> GetMultipleUsers([FromBody] List<int> userIds)
        {
            var users = await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.FollowerCount,
                    u.Category,
                    u.Score,
                    u.PhotoUrl
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchContentCreators(
            [FromQuery] string username = null,
            [FromQuery] string category = null,
            [FromQuery] int? minFollowers = null,
            [FromQuery] int? maxFollowers = null,
            [FromQuery] double? minScore = null,
            [FromQuery] double? maxScore = null
        )
        {
            var query = _context.Users.Where(u => u.Role == UserRole.ContentCreator);
            if (!string.IsNullOrEmpty(username))
            {
                query = query.Where(u => u.Username == username);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(u => u.Category == category);
            }

            if (minFollowers.HasValue)
            {
                query = query.Where(u => u.FollowerCount >= minFollowers.Value);
            }

            if (maxFollowers.HasValue)
            {
                query = query.Where(u => u.FollowerCount <= maxFollowers.Value);
            }

            if (minScore.HasValue)
            {
                query = query.Where(u => u.Score >= minScore.Value);
            }
            if (maxScore.HasValue)
            {
                query = query.Where(u => u.Score <= maxScore.Value);
            }

            var contentCreators = await query.Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.FollowerCount,
                u.Category,
                u.Score,
                u.PhotoUrl
            }).ToListAsync();

            return Ok(contentCreators);
        }

        [HttpGet("validate")]
        public async Task<IActionResult> ValidateUser([FromQuery] string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            return Ok(user != null);
        }
    }
}
