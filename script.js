document.addEventListener("DOMContentLoaded", () => {
  const formCheckin = document.getElementById("form-checkin");
  const container = document.getElementById("lista-participantes");

  const API_URL = "http://localhost:5012/checkins"; // ajuste aqui se a rota real for outra

  // Função para carregar participantes
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
    <button class="fechar-checkin" data-id="checkin-${index}" style="float:right; background:none; border:none; font-size:16px; cursor:pointer;">❌</button>
    <p><strong>Código:</strong> ${p.Codigo}</p>
    <p><strong>Nome:</strong> ${p.NomePessoa}</p>
    <p><strong>Email:</strong> ${p.Email}</p>
    <p><strong>Tipo de Ingresso:</strong> ${p.TipoIngresso}</p>
    <p><strong>Data do Check-in:</strong> ${new Date(
      p.DataHora
    ).toLocaleString()}</p>
  </div>
`
        )
        .join("");

      ativarBotoesFechar(); // <-- Ativa os botões após renderizar os check-ins
    } catch (error) {
      console.error(error);
      container.innerHTML =
        "<p style='color:red;'>Erro ao carregar participantes.</p>";
    }
  }

  // Função para ativar botões de fechar ❌
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

  // Função de envio do formulário
  if (formCheckin) {
    formCheckin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const codigo = document.getElementById("codigo").value.trim();
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const tipoIngresso = document.querySelector(
        'input[name="ingresso"]:checked'
      )?.value;

      if (!codigo || !nome || !email || !tipoIngresso) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      const dados = {
        codigo,
        nomePessoa: nome,
        email,
        tipoIngresso,
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });

        if (response.ok) {
          alert("Check-in realizado com sucesso!");
          formCheckin.reset();
          carregarParticipantes();
        } else {
          const errorData = await response.json();
          alert(errorData.mensagem || "Erro ao registrar o check-in.");
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro na conexão com o servidor.");
      }
    });
  }

  carregarParticipantes();
});