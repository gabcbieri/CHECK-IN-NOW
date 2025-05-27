using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CheckinApi.Data;
using CheckinApi.Models;
using System.Text.Json;

namespace CheckinApi.Controllers
{
    // DTO para receber os dados do front-end
    public class CheckinDto
    {
        public string Codigo { get; set; } = string.Empty;
        public string NomePessoa { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string TipoIngresso { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("checkins")]
    [Produces("application/json")]
    public class CheckinsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CheckinsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCheckins()
        {
            var checkins = await _context.Checkins.ToListAsync();
            return Ok(checkins);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCheckinById(int id)
        {
            var checkin = await _context.Checkins.FindAsync(id);
            if (checkin == null)
                return NotFound(new { mensagem = "Check-in não encontrado." });

            return Ok(checkin);
        }

        [HttpPost]
        public async Task<ActionResult<Checkin>> PostCheckin([FromBody] CheckinDto dto)
        {
            if (dto == null)
                return BadRequest(new { mensagem = "Dados inválidos." });

            if (string.IsNullOrWhiteSpace(dto.NomePessoa) ||
                string.IsNullOrWhiteSpace(dto.Codigo) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.TipoIngresso))
            {
                return BadRequest(new { mensagem = "Por favor, preencha todos os campos obrigatórios." });
            }

            var checkin = new Checkin
            {
                NomePessoa = dto.NomePessoa,
                Codigo = dto.Codigo,
                Email = dto.Email,
                TipoIngresso = dto.TipoIngresso,
                DataHora = DateTime.Now
            };

            _context.Checkins.Add(checkin);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCheckinById), new { id = checkin.Id }, checkin);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCheckin(int id, [FromBody] Checkin updatedCheckin)
        {
            if (updatedCheckin == null)
                return BadRequest(new { mensagem = "Dados inválidos." });

            var existingCheckin = await _context.Checkins.FindAsync(id);
            if (existingCheckin == null)
                return NotFound(new { mensagem = "Check-in não encontrado." });

            existingCheckin.NomePessoa = updatedCheckin.NomePessoa;
            existingCheckin.Codigo = updatedCheckin.Codigo;
            existingCheckin.Email = updatedCheckin.Email;
            existingCheckin.TipoIngresso = updatedCheckin.TipoIngresso;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PartialUpdateCheckin(int id, [FromBody] JsonElement updates)
        {
            var checkin = await _context.Checkins.FindAsync(id);
            if (checkin == null)
                return NotFound(new { mensagem = "Check-in não encontrado." });

            var properties = typeof(Checkin).GetProperties();
            foreach (var prop in updates.EnumerateObject())
            {
                var property = properties.FirstOrDefault(p =>
                    string.Equals(p.Name, prop.Name, StringComparison.OrdinalIgnoreCase));

                // Ignora alterações no campo DataHora
                if (property != null && property.Name != nameof(Checkin.DataHora))
                {
                    var value = JsonSerializer.Deserialize(prop.Value.GetRawText(), property.PropertyType);
                    property.SetValue(checkin, value);
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}