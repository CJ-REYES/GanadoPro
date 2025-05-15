using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GanadoProBackEnd.Data;
using GanadoProBackEnd.Models;
using GanadoProBackEnd.DTOs;

namespace GanadoProBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(MyDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
        {
            return await _context.Users
                .Select(u => new UserResponseDto
                {
                    Id_User = u.Id_User,
                    Name = u.Name,
                    Email = u.Email,
                    Upp = u.Upp
                })
                .ToListAsync();
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] CreateUserDto userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                Upp = userDto.Upp ?? string.Empty
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id_User }, new UserResponseDto
            {
                Id_User = user.Id_User,
                Name = user.Name,
                Email = user.Email,
                Upp = user.Upp
            });
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            return new UserResponseDto
            {
                Id_User = user.Id_User,
                Name = user.Name,
                Email = user.Email,
                Upp = user.Upp
            };
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.Name = updateDto.Name;
            user.Email = updateDto.Email;
            user.Upp = updateDto.Upp;

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                return Unauthorized(new { message = "Credenciales inválidas" });

            var token = GenerateJwtToken(user);
            
            return Ok(new LoginResponseDto
            {
                Token = token,
                User = new UserResponseDto
                {
                    Id_User = user.Id_User,
                    Name = user.Name,
                    Email = user.Email,
                    Upp = user.Upp
                }
            });
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("id", user.Id_User.ToString()),
                new Claim(ClaimTypes.Role, "User")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // DTOs
        public class CreateUserDto
        {
            [Required(ErrorMessage = "El nombre es obligatorio")]
            [StringLength(50, ErrorMessage = "Máximo 50 caracteres")]
            public required string Name { get; set; }

            [Required(ErrorMessage = "El email es obligatorio")]
            [EmailAddress(ErrorMessage = "Formato inválido")]
            public required string Email { get; set; }

            [Required(ErrorMessage = "La contraseña es obligatoria")]
            [DataType(DataType.Password)]
            [MinLength(6, ErrorMessage = "Mínimo 6 caracteres")]
            public required string Password { get; set; }

            [StringLength(20, ErrorMessage = "Máximo 20 caracteres")]
            public string? Upp { get; set; }
        }

        public class UpdateUserDto
        {
            [Required(ErrorMessage = "El nombre es obligatorio")]
            [StringLength(50, ErrorMessage = "Máximo 50 caracteres")]
            public required string Name { get; set; }

            [Required(ErrorMessage = "El email es obligatorio")]
            [EmailAddress(ErrorMessage = "Formato inválido")]
            public required string Email { get; set; }

            [StringLength(20, ErrorMessage = "Máximo 20 caracteres")]
            public string? Upp { get; set; }
        }

        public class UserResponseDto
        {
            public int Id_User { get; set; }
            public string Name { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Upp { get; set; } = null!;
        }

        public class LoginDto
        {
            [Required(ErrorMessage = "El email es obligatorio")]
            [EmailAddress(ErrorMessage = "Formato inválido")]
            public required string Email { get; set; }

            [Required(ErrorMessage = "La contraseña es obligatoria")]
            [DataType(DataType.Password)]
            public required string Password { get; set; }
        }

        public class LoginResponseDto
        {
            public string Token { get; set; } = null!;
            public UserResponseDto User { get; set; } = null!;
        }
    }
}