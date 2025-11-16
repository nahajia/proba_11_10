const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');   // ← NEW LIBRARY

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// static folders
app.use("/kepek", express.static("kepek"));
app.use("/kepek2", express.static("kepek2"));

// MySQL pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jatek2025'
});

// ----------------------------------------------------
// GET example
// ----------------------------------------------------
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// ----------------------------------------------------
// DELETE (already existed)
// ----------------------------------------------------
app.delete('/jatekTorles/:jatek_id', (req, res) => {
    const { jatek_id } = req.params;
    const sql = `DELETE FROM jatek WHERE jatek_id=?`;

    pool.query(sql, [jatek_id], (err) => {
        if (err) return res.status(500).json({ error: "Hiba történt" });
        return res.status(200).json({ message: "Sikeres törlés" });
    });
});

// ----------------------------------------------------
// POST – new jatek INSERT
// ----------------------------------------------------
app.post('/jatekFelvetel', (req, res) => {
    const { nev, kategoria, ar } = req.body;

    // using uuid for safer ID generation
    const id = uuidv4();

    const sql = `INSERT INTO jatek (jatek_id, nev, kategoria, ar) VALUES (?, ?, ?, ?)`;

    pool.query(sql, [id, nev, kategoria, ar], (err) => {
        if (err) return res.status(500).json({ error: "Hiba a feltöltés során" });

        return res.status(201).json({
            message: "Sikeres felvétel",
            inserted_id: id
        });
    });
});

// ----------------------------------------------------
// PUT – update jatek
// ----------------------------------------------------
app.put('/jatekModositas/:jatek_id', (req, res) => {
    const { jatek_id } = req.params;
    const { nev, kategoria, ar } = req.body;

    const sql = `
        UPDATE jatek 
        SET nev=?, kategoria=?, ar=? 
        WHERE jatek_id=?`;

    pool.query(sql, [nev, kategoria, ar, jatek_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Hiba módosításkor" });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Nincs ilyen játék" });
        }

        return res.status(200).json({ message: "Sikeres módosítás" });
    });
});

// Simple test routes
app.get('/h1', (req, res) => res.send("Hello World2g!"));
app.get('/h2', (req, res) => res.send("Hello World2g!"));

// Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
