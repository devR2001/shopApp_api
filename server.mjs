import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
const port = 3000;
app.use(cors());

const db = new sqlite3.Database("articles.db");

db.run(`CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY,
  name TEXT,
  colors TEXT,
  sizes TEXT,
  retail_price REAL
)`);

app.get("/articles", (req, res) => {
  db.all("SELECT * FROM articles", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/articles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.get("SELECT * FROM articles WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: "Artikel nicht gefunden" });
    }
  });
});

app.listen(port, () => {
  console.log(`Die API läuft auf http://localhost:${port}`);
});
