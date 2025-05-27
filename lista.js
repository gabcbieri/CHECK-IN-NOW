const API_URL = "http://localhost:5012/checkins"; // ajuste se necessário
const container = document.getElementById("lista-participantes");

async function carregarParticipantes() {
  if (!container) return;
  container.innerHTML = "<p>Carregando...</p>";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar participantes");
    const participantes = await response.json();

    if (!participantes.length) {
      container.innerHTML = "<p>Nenhum participante encontrado.</p>";
      return;
    }

    container.innerHTML = participantes
      .map(
        (p, index) => `
      <div class="passo" id="checkin-${index}">
        <button class="fechar-checkin" data-id="checkin-${index}" title="Fechar">❌</button>
        <p><strong>Código:</strong> ${p.Codigo || p.codigo}</p>
        <p><strong>Nome:</strong> ${p.NomePessoa || p.nome}</p>
        <p><strong>Email:</strong> ${p.Email || p.email}</p>
        <p><strong>Tipo de Ingresso:</strong> ${p.TipoIngresso || p.tipoIngresso}</p>
        <p><strong>Data do Check-in:</strong> ${new Date(p.DataHora || p.dataHora).toLocaleString()}</p>
      </div>
    `
      )
      .join("");
    ativarBotoesFechar();

    // Salva lista para exportação CSV
    window.listaParticipantes = participantes;

  } catch (error) {
    console.error(error);
    container.innerHTML =
      "<p style='color:red;'>Erro ao carregar participantes.</p>";
  }
}

function ativarBotoesFechar() {
  const botoesFechar = document.querySelectorAll(".fechar-checkin");
  botoesFechar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.remove();
      }
    });
  });
}

// Função para exportar CSV (botão Exportar CSV)
function exportarCSV() {
  const participantes = window.listaParticipantes || [];
  if (!participantes.length) {
    alert("Nenhum participante para exportar.");
    return;
  }

  const header = ["Código", "Nome", "Email", "Tipo de Ingresso", "Data do Check-in"];
  const linhas = participantes.map(p => [
    p.Codigo || p.codigo,
    p.NomePessoa || p.nome,
    p.Email || p.email,
    p.TipoIngresso || p.tipoIngresso,
    new Date(p.DataHora || p.dataHora).toLocaleString()
  ]);

  const csvContent = [header, ...linhas].map(l => l.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "participantes.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Carrega participantes assim que o script rodar
document.addEventListener("DOMContentLoaded", carregarParticipantes);
