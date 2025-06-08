using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CheckinApi.Data;
using CheckinApi.Models;
using System.Text.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CheckinApi.Controllers
{
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
            var checkins = await _context.Checkins
                .Select(c => new
                {
                    id = c.Id,
                    codigo = c.Codigo,
                    nomePessoa = c.NomePessoa,
                    email = c.Email,
                    tipoIngresso = c.TipoIngresso,
                    dataHora = c.DataHora
                })
                .ToListAsync();

            return Ok(checkins);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCheckinById(int id)
        {
            var checkin = await _context.Checkins.FindAsync(id);
            if (checkin == null)
                return NotFound(new { mensagem = "Check-in não encontrado." });

            return Ok(new
            {
                id = checkin.Id,
                codigo = checkin.Codigo,
                nomePessoa = checkin.NomePessoa,
                email = checkin.Email,
                tipoIngresso = checkin.TipoIngresso,
                dataHora = checkin.DataHora
            });
        }

        [HttpPost]
        public async Task<ActionResult> PostCheckin([FromBody] CheckinDto dto)
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

            return CreatedAtAction(nameof(GetCheckinById), new { id = checkin.Id }, new
            {
                id = checkin.Id,
                codigo = checkin.Codigo,
                nomePessoa = checkin.NomePessoa,
                email = checkin.Email,
                tipoIngresso = checkin.TipoIngresso,
                dataHora = checkin.DataHora
            });
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

                if (property != null && property.Name != nameof(Checkin.DataHora))
                {
                    var value = JsonSerializer.Deserialize(prop.Value.GetRawText(), property.PropertyType);
                    property.SetValue(checkin, value);
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCheckin(int id)
        {
            var checkin = await _context.Checkins.FindAsync(id);
            if (checkin == null)
                return NotFound(new { mensagem = "Check-in não encontrado." });

            _context.Checkins.Remove(checkin);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = checkin.Id,
                codigo = checkin.Codigo,
                nomePessoa = checkin.NomePessoa,
                mensagem = "Check-in excluído com sucesso."
            });
        }
    }
}