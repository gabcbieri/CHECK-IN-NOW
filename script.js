document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menu-icon");
  const menu = document.getElementById("menu");
  const menuLinks = document.querySelectorAll(".menu-link");
  const nav = document.querySelector(".navegacao");
  const overlay = document.getElementById("overlay");

  function toggleMenu() {
    menu.classList.toggle("show");
    overlay.classList.toggle("show");
    document.body.classList.toggle("menu-aberto");

    menuIcon.innerHTML = menu.classList.contains("show")
      ? "&times;"
      : "&#9776;";
  }

  menuIcon.addEventListener("click", toggleMenu);

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault(); // só previne se for âncora
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.scrollY;
          const navHeight = nav.offsetHeight;

          window.scrollTo({
            top: targetPosition - navHeight,
            behavior: "smooth",
          });

          if (window.innerWidth <= 768) {
            toggleMenu();
          }
        }
      }
      // senão, deixa seguir normalmente para .html
    });
  });

  overlay.addEventListener("click", () => {
    toggleMenu();
  });
});

function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
  document.body.classList.toggle("menu-aberto");
}

// função para buscar e exibir participantes
async function carregarParticipantes() {
  try {
    const resposta = await fetch("/api/participantes"); // endpoint do seu backend
    const participantes = await resposta.json();

    const lista = document.getElementById("lista-participantes");
    lista.innerHTML = ""; // limpa a lista

    if (participantes.length === 0) {
      lista.innerHTML = "<p>Nenhum participante encontrado.</p>";
      return;
    }

    participantes.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("passo");
      div.innerHTML = `
        <h2>${p.nome}</h2>
        <p><strong>Email:</strong> ${p.email}</p>
        <p><strong>Ingresso:</strong> ${p.tipoIngresso}</p>
        <p><strong>Data do Check-in:</strong> ${new Date(
          p.checkin
        ).toLocaleString()}</p>
      `;
      lista.appendChild(div);
    });
  } catch (erro) {
    console.error("Erro ao carregar participantes:", erro);
    document.getElementById("lista-participantes").innerHTML =
      '<p style="color:red;">Erro ao carregar participantes.</p>';
  }
}

carregarParticipantes(); 

const API_URL = "http://localhost:3000/api/participantes";

function toggleMenu() {
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");
  menu.classList.toggle("show");
  overlay.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const participantesEl = document.getElementById("lista-participantes");
  if (participantesEl) {
    carregarParticipantes();
  }
});

function carregarParticipantes() {
  const container = document.getElementById("lista-participantes");
  if (!container) return;
  container.innerHTML = "<p>Carregando...</p>";

  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) {
        container.innerHTML = "<p>Nenhum participante encontrado.</p>";
        return;
      }

      container.innerHTML = "";
      data.forEach((p) => {
        const div = document.createElement("div");
        div.classList.add("passo");
        div.innerHTML = `
          <p><strong>Código:</strong> ${p.codigo}</p>
          <p><strong>Data do Check-in:</strong> ${new Date(
            p.data_hora
          ).toLocaleString()}</p>
        `;
        container.appendChild(div);
      });
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML = "<p>Erro ao carregar participantes.</p>";
    });
}

function exportarCSV() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      let csv = "Nome,Email,Ingresso\n";
      data.forEach((p) => {
        csv += `"${p.nome}","${p.email}","${p.ingresso}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "participantes.csv";
      link.click();
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-checkin");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const codigo = document.getElementById("codigo").value.trim();

      if (!codigo) return alert("Informe o código do ingresso");

      try {
        const response = await fetch("http://localhost:3000/api/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigo }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Check-in realizado com sucesso!");
          form.reset();
        } else {
          alert(`Erro: ${data.mensagem || "Código inválido"}`);
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-checkin");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const codigo = document.getElementById("codigo").value.trim();

      if (!codigo) {
        alert("Informe o código do ingresso.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/checkin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codigo }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Check-in realizado com sucesso!");
          form.reset();
        } else {
          alert(result.mensagem || "Erro ao registrar código.");
        }
      } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor.");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-entrada");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const codigo = document.getElementById("codigo").value;

      try {
        const resposta = await fetch("http://localhost:3000/api/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigo }),
        });

        const resultado = await resposta.json();
        if (resposta.ok) {
          alert("Check-in realizado com sucesso!");
          form.reset();
        } else {
          alert("Erro: " + resultado.erro);
        }
      } catch (erro) {
        alert("Erro de conexão com o servidor");
        console.error(erro);
      }
    });
  }
});
