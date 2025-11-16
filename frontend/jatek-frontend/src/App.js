import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function App() {
  const [jatekok, setJatekok] = useState([]);
  const [form, setForm] = useState({ nev: "", kategoria: "", ar: "" });
  const [editId, setEditId] = useState(null);

  // ------------------------------
  // LOAD DATA
  // ------------------------------
  const loadData = async () => {
    const res = await axios.get(API + "/osszesJatek"); // You need this route
    setJatekok(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ------------------------------
  // HANDLE INPUT
  // ------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------------------------------
  // ADD NEW GAME
  // ------------------------------
  const addGame = async () => {
    await axios.post(API + "/jatekFelvetel", form);
    setForm({ nev: "", kategoria: "", ar: "" });
    loadData();
  };

  // ------------------------------
  // UPDATE GAME
  // ------------------------------
  const updateGame = async () => {
    await axios.put(API + "/jatekModositas/" + editId, form);
    setForm({ nev: "", kategoria: "", ar: "" });
    setEditId(null);
    loadData();
  };

  // ------------------------------
  // DELETE GAME
  // ------------------------------
  const deleteGame = async (id) => {
    await axios.delete(API + "/jatekTorles/" + id);
    loadData();
  };

  // ------------------------------
  // SET FORM FOR EDITING
  // ------------------------------
  const startEdit = (jatek) => {
    setForm({
      nev: jatek.nev,
      kategoria: jatek.kategoria,
      ar: jatek.ar,
    });
    setEditId(jatek.jatek_id);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Játék kezelő</h1>
      
      <div style={{ marginBottom: 20 }}>
        <h2>{editId ? "Játék módosítása" : "Új játék felvétele"}</h2>

        <input 
          placeholder="Név" 
          name="nev" 
          value={form.nev} 
          onChange={handleChange}
        /><br />

        <input 
          placeholder="Kategória"
          name="kategoria" 
          value={form.kategoria} 
          onChange={handleChange}
        /><br />

        <input 
          placeholder="Ár" 
          name="ar" 
          value={form.ar} 
          onChange={handleChange}
        /><br /><br />

        {editId ? (
          <button onClick={updateGame}>Módosítás</button>
        ) : (
          <button onClick={addGame}>Hozzáadás</button>
        )}
      </div>

      <h2>Játékok</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Név</th>
            <th>Kategória</th>
            <th>Ár</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {jatekok.map((j) => (
            <tr key={j.jatek_id}>
              <td>{j.nev}</td>
              <td>{j.kategoria}</td>
              <td>{j.ar} Ft</td>
              <td>
                <button onClick={() => startEdit(j)}>Szerkesztés</button>
                <button onClick={() => deleteGame(j.jatek_id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
