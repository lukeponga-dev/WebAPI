using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data
{
    public class WebAPI_DataContext : DbContext
    {
        public WebAPI_DataContext (DbContextOptions<WebAPI_DataContext> options)
            : base(options)
        {
        }

        public DbSet<WebAPI.Models.Vehicle> Vehicle { get; set; }
    }
}
