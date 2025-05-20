db.run(`
  CREATE TABLE IF NOT EXISTS participantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL,
    nome TEXT,
    email TEXT,
    ingresso TEXT,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);