const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("frontend"));

// Rota para receber check-in
app.post("/api/checkin", (req, res) => {
  const { codigo, nome, email, ingresso } = req.body;

  if (!codigo) {
    return res.status(400).json({ erro: "Código é obrigatório" });
  }

  db.run(
    "INSERT INTO participantes (codigo, nome, email, ingresso) VALUES (?, ?, ?, ?)",
    [codigo, nome, email, ingresso],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: "Erro ao inserir no banco" });
      }
      res.status(200).json({ mensagem: "Check-in registrado com sucesso!" });
    }
  );
});

// Rota para listar participantes
app.get("/api/participantes", (req, res) => {
  db.all("SELECT * FROM participantes", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar participantes" });
    }
    res.status(200).json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
