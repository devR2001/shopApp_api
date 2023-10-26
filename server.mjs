import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('products.db');

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    colors TEXT,  
    sizes ARRAY, 
    price REAL
  )
`);

app.get('/products', (req, res) => {
  db.all('SELECT id, name, colors, CAST(sizes AS TEXT) as sizes, price FROM products', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const products = rows.map(row => ({
      id: row.id,
      name: row.name,
      colors: row.colors, 
      sizes: JSON.parse(row.sizes),
      price: row.price
    }));

    res.json({ products });
  });
});

app.post('/products', (req, res) => {
  const { name, colors, sizes, price } = req.body;
  if (!name || !colors || !sizes || !price) {
    res.status(400).json({ error: 'Alle Felder müssen ausgefüllt sein.' });
    return;
  }
  

  const sizesJSON = JSON.stringify(sizes);
  
  db.run(
    'INSERT INTO products (name, colors, sizes, price) VALUES (?, ?, ?, ?)',
    [name, colors, JSON.stringify(sizes), price],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Produkt hinzugefügt', id: this.lastID });
    }
  );
});

app.listen(3000, () => {
  console.log('Server läuft auf Port 3000');
});
