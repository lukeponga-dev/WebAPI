using Microsoft.EntityFrameworkCore;

namespace WebAPI.Data
{
    public class WebAPI_DataContext : DbContext
    {
        public WebAPI_DataContext(DbContextOptions<WebAPI_DataContext> options)
            : base(options)
        {
        }

        public DbSet<Models.Vehicle> Vehicle { get; set; }


    }
}