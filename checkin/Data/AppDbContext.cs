using Microsoft.EntityFrameworkCore;
using CheckinApi.Models;

namespace CheckinApi.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Checkin> Checkins { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}