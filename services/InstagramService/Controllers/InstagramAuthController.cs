using InstagramService.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstagramService.Controllers
{
    [ApiController]
    [Route("api/instagram")]
    public class InstagramAuthController : ControllerBase
    {
        private readonly IInstagramAuthService _authService;

        public InstagramAuthController(IInstagramAuthService authService)
        {
            _authService = authService;
        }
        [Authorize(Roles ="ContentCreator")]
        [HttpGet("login-url")]
        public IActionResult GetLoginUrl()
        {
            var url = _authService.GenerateLoginUrl();
            return Ok(new { url });
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] int userId)
        {
            if (string.IsNullOrEmpty(code)) return BadRequest("Code is missing");

            var success = await _authService.HandleCallbackAsync(code, userId);
            return success ? Ok("Instagram account connected") : StatusCode(500, "Failed to connect account");
        }
    }
}
