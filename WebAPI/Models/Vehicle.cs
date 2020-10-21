using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Vehicle
    {
        //vehicles primary key
        [Key]
        public int Id { get; set; }

        //vehicle reg
        public string Reg { get; set; }

        //vehicle make
        public string Make { get; set; }

        //vehicle model
        public string Model { get; set; }

        //vehicle colour
        public string Colour { get; set; }

        //vehicle year
        public int Year { get; set; }
    }
}