const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// In-memory "database"
let jatekok = [];

// --------------------
// GET ALL GAMES
// --------------------
app.get('/osszesJatek', (req, res) => {
    res.json(jatekok);
});

// --------------------
// ADD GAME (POST)
// --------------------
app.post('/jatekFelvetel', (req, res) => {
    const { nev, kategoria, ar } = req.body;

    const ujJatek = {
        jatek_id: uuidv4(),
        nev,
        kategoria,
        ar
    };

    jatekok.push(ujJatek);

    res.status(201).json({
        message: "Játék hozzáadva",
        jatek: ujJatek
    });
});

// --------------------
// UPDATE GAME (PUT)
// --------------------
app.put('/jatekModositas/:jatek_id', (req, res) => {
    const { jatek_id } = req.params;
    const { nev, kategoria, ar } = req.body;

    const index = jatekok.findIndex(j => j.jatek_id === jatek_id);

    if (index === -1) {
        return res.status(404).json({ error: "Nincs ilyen játék" });
    }

    jatekok[index] = {
        ...jatekok[index],
        nev,
        kategoria,
        ar
    };

    res.json({ message: "Sikeres módosítás", jatek: jatekok[index] });
});

// --------------------
// DELETE GAME
// --------------------
app.delete('/jatekTorles/:jatek_id', (req, res) => {
    const { jatek_id } = req.params;

    const before = jatekok.length;
    jatekok = jatekok.filter(j => j.jatek_id !== jatek_id);

    if (jatekok.length === before) {
        return res.status(404).json({ error: "Nincs ilyen játék" });
    }

    res.json({ message: "Játék törölve" });
});

// --------------------
// Simple test routes
// --------------------
app.get('/', (req, res) => {
    res.send("Server running without database!");
});

// Start server
app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
