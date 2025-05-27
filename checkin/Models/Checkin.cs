namespace CheckinApi.Models
{
    public class Checkin
{
    public int Id { get; set; }
    public string Codigo { get; set; }
    public string NomePessoa { get; set; }
    public string Email { get; set; }
    public string TipoIngresso { get; set; }
    public DateTime DataHora { get; set; } = DateTime.Now;
}
}