const API_URL = "http://localhost:5012/checkins";

document.getElementById("form-checkin")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = document.getElementById("codigo").value.trim();
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const tipoIngresso = document.querySelector('input[name="ingresso"]:checked')?.value;

  if (!tipoIngresso) {
    alert("Selecione o tipo de ingresso.");
    return;
  }

  const checkin = {
    Codigo: codigo,
    NomePessoa: nome,
    Email: email,
    TipoIngresso: tipoIngresso,
    DataHora: new Date().toISOString()
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(checkin)
    });

    if (!response.ok) throw new Error("Erro ao registrar check-in");

    alert("Check-in realizado com sucesso!");
    document.getElementById("form-checkin").reset();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao registrar check-in.");
  }
});