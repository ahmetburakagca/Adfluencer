using CampaignService.Data;
using CampaignService.Models;
using CampaignService.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Text;
using CampaignService.Dtos;
using CampaignService.Enums;
using Azure.Core;
using Microsoft.OpenApi.Validations;

namespace CampaignService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CampaignsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;

        public CampaignsController(AppDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCampaigns()
        {
            var campaigns = await _context.Campaigns
                .Where(c => c.Status == Enums.CampaignStatus.Active)
                .ToListAsync();

            var advertiserIds = campaigns.Select(c => c.AdvertiserId).Distinct().ToList();

            var advertiserInfos = await GetMultipleUsers(advertiserIds);

            if (advertiserInfos == null)
                return StatusCode(500, "Advertiser bilgileri alınamadı.");

            var campaignWithAdvertiser = campaigns.Select(c =>
            {
                var advertiser = advertiserInfos.FirstOrDefault(a => a.Id == c.AdvertiserId);

                return new
                {
                    c.Id,
                    c.Title,
                    c.Description,
                    c.Budget,
                    c.Status,
                    c.MaxCapacity,
                    Advertiser = advertiser != null ? new
                    {
                        advertiser.Id,
                        advertiser.Username,
                        advertiser.Category,
                        advertiser.PhotoUrl
                    } : null
                };
            }).ToList();

            return Ok(campaignWithAdvertiser);
        }

        [Authorize(Roles = "Advertiser")]
        [HttpPost]
        public async Task<IActionResult> CreateCampaign(CampaignCreateRequest request)
        {
            var advertiserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var campaign = new Campaign
            {
                Title = request.Title,
                Description = request.Description,
                Budget = request.Budget,
                Status = request.Status,
                AdvertiserId = advertiserId,
                MaxCapacity = request.MaxCapacity
            };

            _context.Campaigns.Add(campaign);
            await _context.SaveChangesAsync();

            return Ok("Campaign created successfully.");
        }

        [Authorize(Roles = "Advertiser")]
        [HttpPut("{campaignId}")]
        public async Task<IActionResult> UpdateCampaign(int campaignId, [FromBody] CampaignUpdateRequest request)
        {
            var advertiserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var campaign = await _context.Campaigns.FindAsync(campaignId);
            if (campaign == null) return NotFound();
            if (campaign.AdvertiserId != advertiserId) return Forbid();

            if (!string.IsNullOrEmpty(request.Title)) campaign.Title = request.Title;
            if (!string.IsNullOrEmpty(request.Description)) campaign.Description = request.Description;
            if (request.Budget.HasValue) campaign.Budget = request.Budget;
            if (request.Status.HasValue)
            {
                if (!Enum.IsDefined(typeof(CampaignStatus), request.Status)) return BadRequest("Geçersiz durum değeri.");
                var enumStatus = (CampaignStatus)request.Status;
                campaign.Status = enumStatus;
            }
            if (request.MaxCapacity.HasValue) campaign.MaxCapacity = request.MaxCapacity;
            
            _context.Campaigns.Update(campaign);
            await _context.SaveChangesAsync();
            return Ok(campaign);
        }

        [Authorize(Roles = "Advertiser")]
        [HttpGet("my-campaigns")]
        public async Task<IActionResult> GetMyCampaigns()
        {
            var advertiserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
           

            var campaigns = await _context.Campaigns
                .Where(c => c.AdvertiserId == advertiserId)
                .Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.Description,
                    c.Budget,
                    c.Status,
                    c.MaxCapacity,
                    
                })
                .ToListAsync();

            return Ok(ResponseDto<object>.SuccessResponse(campaigns, "Campaigns başarıyla geldi.", 200));
        }

        [Authorize(Roles = "Advertiser")]
        [HttpPost("{campaignId}/invite/{contentCreatorId}")]
        public async Task<IActionResult> InviteContentCreator(int campaignId, int contentCreatorId)
        {
            var campaign = await _context.Campaigns.FindAsync(campaignId);

            if (campaign == null)
            {
                return NotFound("Campaign not found.");
            }

            //contentCreatorId kontrolü sağlanacak 
            bool alreadyInvited = await _context.CampaignInvitations
    .AnyAsync(i => i.CampaignId == campaignId && i.ContentCreatorId == contentCreatorId);

            if (alreadyInvited)
            {
                return BadRequest("Bu içerik üreticisi zaten bu kampanyaya davet edildi.");
            }


            var invitation = new CampaignInvitation
            {
                CampaignId = campaignId,
                ContentCreatorId = contentCreatorId,
                Status = Enums.InvitationStatus.Pending,
                Campaign = campaign
            };

            _context.CampaignInvitations.Add(invitation);
            await _context.SaveChangesAsync();

            return Ok("Content creator invited successfully.");
        }

        [Authorize(Roles = "ContentCreator")]
        [HttpPost("{campaignId}/apply")]
        public async Task<IActionResult> ApplyToCampaign(int campaignId)
        {
            var contentCreatorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var campaign = await _context.Campaigns.FindAsync(campaignId);

            if (campaign == null) return NotFound("Campaign not found");

            if (campaign.Status == CampaignStatus.Passive) return BadRequest("Campaign is not active.");

            var existingApplication = await _context.Applications
                .FirstOrDefaultAsync(a => a.CampaignId == campaignId && a.ContentCreatorId == contentCreatorId);

            if (existingApplication != null) return BadRequest("You have already applied to this campaign.");

            var application = new Application
            {
                CampaignId = campaignId,
                ContentCreatorId = contentCreatorId,
                Status = Enums.ApplicationStatus.Pending,
                ApplicationDate = DateTime.UtcNow,
                Campaign = campaign
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok("Application submitted successfully");
        }

        [Authorize(Roles = "ContentCreator")]
        [HttpGet("my-applications")]
        public async Task<IActionResult> GetMyApplications()
        {
            var contentCreatorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var applications = await _context.Applications
                .Where(a => a.ContentCreatorId == contentCreatorId)
                .Select(a => new
                {
                    a.Id,
                    a.CampaignId,
                    a.Campaign.AdvertiserId,
                    a.Campaign.Title,
                    a.Status,
                    a.ApplicationDate,
                   
                }).ToListAsync();

            return Ok(applications);
        }

        [Authorize(Roles = "Advertiser")]
        [HttpGet("{campaignId}/applications")]
        public async Task<IActionResult> GetCampaignApplications(int campaignId)
        {
            var advertiserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var campaign = await _context.Campaigns
                .Include(c => c.Applications)
                .FirstOrDefaultAsync(c => c.Id == campaignId && c.AdvertiserId == advertiserId);

            if (campaign == null) return NotFound("Campaign not found");
            //applications gönderirken contentcreator alınacak ismi çekilecek
            var applications = campaign.Applications
                .Select(a => new
                {
                    a.Id,
                    a.CampaignId,
                    a.ContentCreatorId,
                    a.Status,
                    a.ApplicationDate
                }).ToList();

            return Ok(applications);
        }

        [Authorize(Roles = "Advertiser")]
        [HttpGet("all-applications")]
        public async Task<IActionResult> GetAllApplications()
        {
            var advertiserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var applications = await _context.Applications
                .Where(a => a.Campaign.AdvertiserId == advertiserId)
                .Select(a => new
                {
                    a.Id,
                    a.CampaignId,
                    CampaignName = a.Campaign.Title,
                    a.ContentCreatorId,
                    a.Status,
                    a.ApplicationDate,
                    a.Campaign.AdvertiserId
                }).ToListAsync();

            var contentCreatorIds = applications.Select(a => a.ContentCreatorId).Distinct().ToList();
            var contentCreators = await GetMultipleUsers(contentCreatorIds);

            if (contentCreators == null)
                return StatusCode(500, "Content creator bilgileri alınamadı.");

            var applicationsWithDetails = applications.Select(a =>
            {
                var contentCreator = contentCreators.FirstOrDefault(c => c.Id == a.ContentCreatorId);
                return new
                {
                    a.Id,
                    a.CampaignId,
                    a.CampaignName,
                    ContentCreator = contentCreator != null ? new
                    {
                        contentCreator.Id,
                        contentCreator.Username,
                        PhotoUrl = contentCreator.PhotoUrl // Düzeltilen alan: Photo yerine PhotoUrl gönderiliyor
                    } : null,
                    a.Status,
                    a.ApplicationDate,
                    advertiserId
                    
                };
            }).ToList();

            return Ok(applicationsWithDetails);
        }

        [Authorize(Roles = "Advertiser")]
        [HttpPut("{campaignId}/applications/{applicationId}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(int campaignId, int applicationId, [FromBody] UpdateApplicationStatusRequest request)
        {
            if (!Enum.IsDefined(typeof(ApplicationStatus), request.Status)) return BadRequest("Geçersiz durum değeri");
            var enumStatus = (ApplicationStatus)request.Status;

            var application = await _context.Applications
                .Include(a => a.Campaign)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null) return NotFound("Application not found");

            var campaign = await _context.Campaigns
                .FirstOrDefaultAsync(c => c.Id == application.CampaignId);

            var advertiserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (campaign == null)
            {
                return NotFound("Campaign not found.");
            }

            if (campaign.AdvertiserId != advertiserId)
            {
                return Unauthorized("You do not have permission to update this application.");
            }

            application.Status = enumStatus;
            _context.Applications.Update(application);

            if (enumStatus == ApplicationStatus.Accepted)
            {
                var currentAgreementCount = await _context.Agreements
                    .CountAsync(a => a.CampaignId == campaign.Id && a.Status == AgreementStatus.Active);

                if (currentAgreementCount >= campaign.MaxCapacity)
                {
                    return BadRequest("Bu kampanya için maksimum influencer kapasitesine ulaşıldı.");
                }
                

                var agreement = new Agreement
                {
                    CampaignId = application.CampaignId,
                    ContentCreatorId = application.ContentCreatorId,
                    AdvertiserId = campaign.AdvertiserId,
                    Status = AgreementStatus.Active,
                    AgreementDate = DateTime.UtcNow,
                    Campaign = campaign
                };

                _context.Agreements.Add(agreement);
            }

            await _context.SaveChangesAsync();

            return Ok("Application status updated successfully.");
        }

        [Authorize(Roles = "ContentCreator")]
        [HttpPut("invitations/{invitationId}/status")]
        public async Task<IActionResult> UpdateInvitationStatus(int invitationId, [FromBody] UpdateInvitationStatusRequest request)
        {
            if (!Enum.IsDefined(typeof(InvitationStatus), request.Status)) return BadRequest("Geçersiz durum değeri");
            var enumStatus = (InvitationStatus)request.Status;

            var contentCreatorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var invitation = await _context.CampaignInvitations
                .Include(i => i.Campaign)
                .FirstOrDefaultAsync(i => i.Id == invitationId && i.ContentCreatorId == contentCreatorId);

            if (invitation == null) return NotFound("Invitation not found");

            invitation.Status = enumStatus;
            _context.CampaignInvitations.Update(invitation);

            if (enumStatus == InvitationStatus.Accepted)
            {
                var currentAgreementCount = await _context.Agreements
                    .CountAsync(a => a.CampaignId == invitation.CampaignId && a.Status == AgreementStatus.Active);

                if (currentAgreementCount >= invitation.Campaign.MaxCapacity)
                {
                    return BadRequest("Bu kampanya için maksimum influencer kapasitesine ulaşıldı.");
                }

                var agreement = new Agreement
                {
                    CampaignId = invitation.CampaignId,
                    ContentCreatorId = contentCreatorId,
                    AdvertiserId = invitation.Campaign.AdvertiserId,
                    Status = AgreementStatus.Active,
                    AgreementDate = DateTime.UtcNow,
                    Campaign = invitation.Campaign
                };

                _context.Agreements.Add(agreement);
            }
            await _context.SaveChangesAsync();

            return Ok("Invitation status updated successfully.");
        }

        [Authorize(Roles = "ContentCreator")]
        [HttpGet("my-invitations")]
        public async Task<IActionResult> GetMyInvitations()
        {
            var contentCreatorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var invitations = await _context.CampaignInvitations
                .Where(i => i.ContentCreatorId == contentCreatorId)
                .Select(i => new
                {
                    i.Id,
                    i.CampaignId,
                    i.Campaign.Title,
                    i.Campaign.Description,
                    i.Campaign.Budget,
                    i.Status,
                    i.Campaign.AdvertiserId,
                    i.ContentCreatorId
                }).
                ToListAsync();

            return Ok(invitations);
        }

        [Authorize(Roles = "Advertiser")]
        [HttpGet("{campaignId}/invitations")]
        public async Task<IActionResult> GetCampaignInvitations(int campaignId)
        {
            var advertiserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var campaign = await _context.Campaigns
                .Include(c => c.Invitations)
                .FirstOrDefaultAsync(c => c.Id == campaignId && c.AdvertiserId == advertiserId);

            if (campaign == null) return NotFound("Campaign not found.");

            var invitations = campaign.Invitations
                .Select(i => new
                {
                    i.Id,
                    i.ContentCreatorId,
                    i.Status
                }).ToList();

            return Ok(invitations);
        }

        [Authorize(Roles = "ContentCreator,Advertiser")]
        [HttpGet("my-agreements")]
        public async Task<IActionResult> GetMyAgreements()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userRole = User.FindFirst(ClaimTypes.Role).Value;

            var agreements = await _context.Agreements
                .Where(a => (userRole == "ContentCreator" && a.ContentCreatorId == userId) ||
                            (userRole == "Advertiser" && a.AdvertiserId == userId))
                .Select(a => new
                {
                    a.Id,
                    a.CampaignId,
                    a.Campaign.Title,
                    a.Campaign.Description,
                    a.Campaign.Budget,
                    a.Status,
                    a.AgreementDate,
                    a.AdvertiserId,
                    a.ContentCreatorId
                })
                .ToListAsync();

            return Ok(agreements);
        }
        //ödeme yapıldıktan sonra agreement status güncelleme
        [HttpPut("agreements/{id}/payment")]
        public async Task<IActionResult> UpdateAgreementPaymentStatus(int id, [FromBody] UpdateAgreementStatusRequest request)
        {
            var agreement = await _context.Agreements.FindAsync(id);
            if (agreement == null) return NotFound();
            if (!Enum.IsDefined(typeof(InvitationStatus), request.Status)) return BadRequest("Geçersiz durum değeri.");
            var enumStatus = (AgreementStatus)request.Status;

            agreement.Status = enumStatus;
            _context.Agreements.Update(agreement);
            await _context.SaveChangesAsync();

            return Ok("Agreement payment status updated.");
        }

        [HttpGet("validate-agreement")]
        public async Task<IActionResult> ValidateAgreement(int userId1, int userId2, int campaignId)
        {
            var agreement = await _context.Agreements
                .FirstOrDefaultAsync(a =>
                    ((a.ContentCreatorId == userId1 && a.AdvertiserId == userId2) ||
                    (a.ContentCreatorId == userId2 && a.AdvertiserId == userId1)) &&
                    (a.CampaignId == campaignId));

            if (agreement == null) return Ok(new { IsMatch = false });

            return Ok(new { IsMatch = true });
        }

        [HttpGet("validate-agreement-for-message")]
        public async Task<IActionResult> ValidateAgreementForMessage(int userId1, int userId2)
        {
            var agreement = await _context.Agreements
                .FirstOrDefaultAsync(a =>
                    (a.ContentCreatorId == userId1 && a.AdvertiserId == userId2) ||
                    (a.ContentCreatorId == userId2 && a.AdvertiserId == userId1));

            if (agreement == null) return Ok(new { IsMatch = false });

            return Ok(new { IsMatch = true });
        }

        [HttpGet("{userId}")]
        public async Task<UserResponse?> GetUserDetails(int userId)
        {
            var token = Request.Headers["Authorization"].ToString()?.Replace("Bearer ", "");

            var requestMessage = new HttpRequestMessage(HttpMethod.Get, $"https://localhost:5001/api/Users/{userId}");
            requestMessage.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.SendAsync(requestMessage);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine(response.StatusCode);
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<UserResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        [HttpPost("multiple")]
        public async Task<List<UserResponse>?> GetMultipleUsers([FromBody] List<int> userIds)
        {
            // Authorization header'dan Bearer token'ı çekiyoruz
            var token = Request.Headers["Authorization"].ToString()?.Replace("Bearer ", "");

            var request = new HttpRequestMessage(HttpMethod.Post, "https://localhost:5001/api/Users/multiple");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            request.Content = new StringContent(
                JsonSerializer.Serialize(userIds),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);
            Console.WriteLine(response);

            if (!response.IsSuccessStatusCode)
            {
                return null; // Hata durumu
            }

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<UserResponse>>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        public class UserResponse
        {
            public int Id { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public int Role { get; set; }
            public int? FollowerCount { get; set; } // Sadece ContentCreator rolü için
            public double? EngagementRate { get; set; } // Sadece ContentCreator rolü için
            public string Category { get; set; } // İçerik üreticisinin kategorisi
            public string PhotoUrl { get; set; }
        }
    }
}
