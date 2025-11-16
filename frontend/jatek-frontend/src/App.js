import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function App() {
  const [jatekok, setJatekok] = useState([]);
  const [form, setForm] = useState({ nev: "", kategoria: "", ar: "" });
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const res = await axios.get(API + "/osszesJatek");
    setJatekok(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addGame = async () => {
    await axios.post(API + "/jatekFelvetel", form);
    setForm({ nev: "", kategoria: "", ar: "" });
    loadData();
  };

  const updateGame = async () => {
    await axios.put(API + "/jatekModositas/" + editId, form);
    setForm({ nev: "", kategoria: "", ar: "" });
    setEditId(null);
    loadData();
  };

  const deleteGame = async (id) => {
    await axios.delete(API + "/jatekTorles/" + id);
    loadData();
  };

  const startEdit = (jatek) => {
    setForm({
      nev: jatek.nev,
      kategoria: jatek.kategoria,
      ar: jatek.ar,
    });
    setEditId(jatek.jatek_id);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎮 Játék kezelő</h1>

      <div style={styles.formBox}>
        <h2 style={styles.subtitle}>
          {editId ? "Játék módosítása" : "Új játék felvétele"}
        </h2>

        <input
          style={styles.input}
          placeholder="Név"
          name="nev"
          value={form.nev}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          placeholder="Kategória"
          name="kategoria"
          value={form.kategoria}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          placeholder="Ár"
          name="ar"
          value={form.ar}
          onChange={handleChange}
        />

        {editId ? (
          <button style={styles.buttonPrimary} onClick={updateGame}>
            Módosítás
          </button>
        ) : (
          <button style={styles.buttonPrimary} onClick={addGame}>
            Hozzáadás
          </button>
        )}
      </div>

      <h2 style={styles.subtitle}>📋 Játékok</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Név</th>
            <th style={styles.th}>Kategória</th>
            <th style={styles.th}>Ár</th>
            <th style={styles.th}>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {jatekok.map((j) => (
            <tr key={j.jatek_id}>
              <td style={styles.td}>{j.nev}</td>
              <td style={styles.td}>{j.kategoria}</td>
              <td style={styles.td}>{j.ar} Ft</td>
              <td style={styles.td}>
                <button style={styles.buttonEdit} onClick={() => startEdit(j)}>
                  Szerkesztés
                </button>
                <button
                  style={styles.buttonDelete}
                  onClick={() => deleteGame(j.jatek_id)}
                >
                  Törlés
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------------
// STYLES
// ------------------------------
const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
    maxWidth: 800,
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    marginBottom: 30,
  },

  formBox: {
    background: "#f4f4f4",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },

  subtitle: {
    marginBottom: 15,
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  },

  buttonPrimary: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 10,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },

  th: {
    background: "#333",
    color: "white",
    padding: 10,
  },

  td: {
    padding: 10,
    borderBottom: "1px solid #ddd",
  },

  buttonEdit: {
    marginRight: 10,
    padding: "6px 12px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },

  buttonDelete: {
    padding: "6px 12px",
    background: "#f44336",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};

export default App;
