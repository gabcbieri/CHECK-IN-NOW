namespace CheckinApi.Models
{
    public class Checkin
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string NomePessoa { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string TipoIngresso { get; set; } = string.Empty;
        public DateTime DataHora { get; set; } = DateTime.Now;
    }
}
