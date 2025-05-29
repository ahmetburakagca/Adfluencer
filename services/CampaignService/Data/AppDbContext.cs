using CampaignService.Models;
using Microsoft.EntityFrameworkCore;

namespace CampaignService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }

        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<CampaignInvitation> CampaignInvitations { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Agreement> Agreements { get; set; }
    }
}
