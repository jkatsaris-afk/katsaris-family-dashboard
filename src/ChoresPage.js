import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbxI7M5QOzcNfGoU372FYXzyhJpLDsP6IYrWzRxbkkIanRxOM0Lp1JNjvCkLyPhEjMNb/exec";

export default function ChoresPage() {
  const [kids] = useState(["Sam", "Kade", "Ava"]);
  const [chores, setChores] = useState([]);

  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // 🔄 LOAD + AUTO REFRESH
  useEffect(() => {
    const loadData = () => {
      fetch(API_URL)
        .then(res => res.json())
        .then(data => {
          const formatted = data.slice(1).map(row => ({
            id: row[0],
            assignedTo: row[1],
            text: row[2],
            done: row[3] === true || row[3] === "TRUE"
          }));

          setChores(formatted);
        })
        .catch(err => console.error("Load error:", err));
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ➕ ADD CHORE
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
        id: Date.now(), // temp ID until refresh
        text: newChore,
        assignedTo,
        done: false
      }
    ]);

    setNewChore("");
  };

  // ✅ TOGGLE + SAVE
  const toggleChore = (index) => {
    const updated = [...chores];
    updated[index].done = !updated[index].done;

    const chore = updated[index];

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        update: true,
        id: chore.id,
        done: chore.done
      })
    });

    setChores(updated);
  };

  return (
    <div style={{ padding: "20px", background: "#f3f4f6", minHeight: "100vh" }}>
      
      <h1 style={{ marginBottom: "20px" }}>Chore Dashboard</h1>

      {/* ADD CHORE CARD */}
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
