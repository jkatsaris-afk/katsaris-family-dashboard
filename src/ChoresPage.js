import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzMhNEAhNLCFm0uqAqEzyFgaO7c53F5NuyZojagI2CrTCNfkFViM03RvgJ6_pgwp7Kr/exec";

export default function ChoresPage() {
  const [kids] = useState(["Sam", "Kade", "Ava"]);
  const [chores, setChores] = useState([]);

  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // LOAD DATA
  useEffect(() => {
    const loadData = () => {
      fetch(API_URL)
        .then(res => res.json())
        .then(data => {
          const formatted = data.slice(1).map((row, index) => ({
            id: row[0],
            assignedTo: row[1],
            text: row[2],
            done: row[3] === true || row[3] === "TRUE",
            row: index + 2
          }));

          setChores(formatted);
        })
        .catch(err => console.error(err));
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ADD CHORE
  const addChore = () => {
    if (!newChore || !assignedTo) return;

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name: assignedTo,
        chore: newChore,
        done: false
      })
    });

    setChores([
      ...chores,
      {
        text: newChore,
        assignedTo,
        done: false
      }
    ]);

    setNewChore("");
  };

  // TOGGLE DONE + SAVE
  const toggleChore = (index) => {
    const updated = [...chores];
    updated[index].done = !updated[index].done;

    const chore = updated[index];

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        update: true,
        row: chore.row,
        done: chore.done
      })
    });

    setChores(updated);
  };

  return (
    <div style={{ padding: "20px", background: "#f3f4f6", minHeight: "100vh" }}>
      
      <h1 style={{ marginBottom: "20px" }}>Chore Dashboard</h1>

      {/* ADD CHORE */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
      }}>
        <h3>Add Chore</h3>

        <input
          placeholder="New Chore"
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        >
          <option value="">Assign To</option>
          {kids.map((kid, i) => (
            <option key={i} value={kid}>{kid}</option>
          ))}
        </select>

        <button onClick={addChore}>Add</button>
      </div>

      {/* CHORE LIST */}
      {chores.map((chore, index) => (
        <div
          key={index}
          onClick={() => toggleChore(index)}
          style={{
            background: "#fff",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
          }}
        >
          <div>
            <strong>{chore.text}</strong>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {chore.assignedTo}
            </div>
          </div>

          <div style={{ fontSize: "20px" }}>
            {chore.done ? "✅" : "⬜"}
          </div>
        </div>
      ))}
    </div>
  );
}
