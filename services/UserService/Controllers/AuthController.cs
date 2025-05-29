using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using UserService.Data;
using UserService.Models;
using UserService.DTOs;
using System.Security.Cryptography;
using UserService.Helpers;
using UserService.Services;
using UserService.Enums;
using UserService.Dtos;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly PhotoService _photoService;

        public AuthController(AppDbContext context, IConfiguration configuration, PhotoService photoService)
        {
            _context = context;
            _configuration = configuration;
            _photoService = photoService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] UserRegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(ResponseDto<string>.FailResponse("Kullanıcı adı zaten mevcut.", 409));
            }

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(ResponseDto<string>.FailResponse("Email zaten kayıtlı.", 409));
            }

            var salt = PasswordHasher.GenerateSalt();
            var hashedPassword = PasswordHasher.HashPassword(request.Password, salt);

            string? photoUrl = null;
            string? photoPublicId = null;

            if (request.Photo != null)
            {
                var result_photo = await _photoService.AddPhotoAsync(request.Photo);

                if (result_photo.Error != null)
                {
                    return StatusCode(500, ResponseDto<string>.FailResponse("Fotoğraf yükleme başarısız.", 500));
                }

                photoUrl = result_photo.SecureUrl.AbsoluteUri;
                photoPublicId = result_photo.PublicId;
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = hashedPassword,
                Salt = salt,
                Role = request.Role,
                Category = request.Category,
                PhotoUrl = photoUrl,
                PhotoPublicId = photoPublicId
            };

            if (request.Role == UserRole.ContentCreator)
            {
                user.FollowerCount = request.FollowerCount;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(ResponseDto<string>.SuccessResponse(null, "Kullanıcı başarıyla kaydedildi.", 200));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest(ResponseDto<string>.FailResponse("Geçersiz kullanıcı bilgisi.", 401));
            }

            var hashedPassword = PasswordHasher.HashPassword(request.Password, user.Salt);
            if (hashedPassword != user.PasswordHash)
            {
                return BadRequest(ResponseDto<string>.FailResponse("Geçersiz kullanıcı bilgisi.", 401));
            }

            var token = GenerateJwtToken(user);

            var response = new LoginResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username=user.Username,
                    Email = user.Email,
                    Role=user.Role
                    
                }
            };

            return Ok(ResponseDto<LoginResponseDto>.SuccessResponse(response, "Giriş başarılı.", 200));
        }



        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()) // enum -> string
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(600),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
