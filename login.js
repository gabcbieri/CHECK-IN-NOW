document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = this.email.value.trim();
  const senha = this.senha.value.trim();
  const avisoSenha = document.getElementById("senha-aviso");
  const modal = document.getElementById("modal-sucesso");

  // Esconder aviso ao tentar submeter
  avisoSenha.style.display = "none";
  avisoSenha.textContent = "";

  if (!senha) {
    avisoSenha.textContent = "Por favor, preencha o campo de senha.";
    avisoSenha.style.display = "block";Cr
    return;
  }

  if (senha !== "AHDU18") {
    avisoSenha.textContent = "Senha incorreta. Tente novamente.";
    avisoSenha.style.display = "block";
    return;
  }

  // Se chegou aqui, login OK
  modal.style.display = "block";
  modal.classList.add("show");

  setTimeout(() => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      window.location.href = "index.html";
    }, 500);
  }, 3000);
});
