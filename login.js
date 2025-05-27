document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha email e senha.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5285/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, SenhaHash: senha }), 
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("modal-sucesso").style.display = "block";
    } else {
      alert(data.message || "Email ou senha incorretos.");
    }
  } catch (error) {
    console.error("Erro na conexão:", error);
    alert("Erro ao conectar com o servidor.");
  }
});