document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("lista-participantes");
  const API_URL = "http://localhost:5012/checkins";

  async function carregarParticipantes() {
    if (!container) return;

    container.innerHTML = "<p>Carregando...</p>";
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erro ao buscar participantes");

      const participantes = await response.json();
      console.log("Participantes recebidos:", participantes); // ✅ MOVIDO PARA DENTRO

      if (!participantes.length) {
        container.innerHTML = "<p>Nenhum participante encontrado.</p>";
        return;
      }

      container.innerHTML = participantes
        .map((p, index) => `
          <div class="passo" id="checkin-${index}">
            <button class="fechar-checkin" data-id="checkin-${index}">❌</button>
            <p><strong>Código:</strong> ${p.codigo}</p>
            <p><strong>Nome:</strong> ${p.nomePessoa}</p>
            <p><strong>Email:</strong> ${p.email}</p>
            <p><strong>Tipo de Ingresso:</strong> ${p.tipoIngresso}</p>
            <p><strong>Data do Check-in:</strong> ${new Date(p.dataHora).toLocaleString()}</p>
          </div>
        `)
        .join("");

      document.querySelectorAll(".fechar-checkin").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const elemento = document.getElementById(id);
          if (elemento) elemento.remove();
        });
      });
    } catch (error) {
      console.error(error);
      container.innerHTML = "<p style='color:red;'>Erro ao carregar participantes.</p>";
    }
  }

  carregarParticipantes();
});