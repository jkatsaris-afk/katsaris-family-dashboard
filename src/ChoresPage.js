import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyTHZiC1Tcghz0nyUvY8qRiUhcllQapC4OKIwzRS35gIq0eYVmBE7sXiNWhzctQJbVI/exec";

// 🎨 Kid styling
const kidColors = {
  Sam: "#3b82f6",
  Kade: "#10b981",
  Ava: "#ec4899"
};

const kidIcons = {
  Sam: "🟦",
  Kade: "🟩",
  Ava: "🟪"
};

export default function ChoresPage({ goHome }) {
  const [kids] = useState(["Sam", "Kade", "Ava"]);
  const [chores, setChores] = useState([]);

  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [selectedKid, setSelectedKid] = useState("All");

  // 🔄 LOAD
  useEffect(() => {
    const loadData = () => {
      fetch(API_URL)
        .then(res => res.json())
        .then(data => {
          const formatted = data.slice(1).map(row => ({
            id: row[0],
            assignedTo: row[1],
            text: row[2],
            done: row[3] === true || row[3] === "TRUE",
            points: row[4] || 0
          }));

          setChores(formatted);
        });
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ➕ ADD
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

    setNewChore("");
  };

  // ✅ TOGGLE
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

      {/* 🔙 BACK */}
      <button onClick={goHome} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      <h1 style={{ marginBottom: "20px" }}>Chores</h1>

      {/* 👦 KID TILES */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: "10px",
        marginBottom: "20px"
      }}>
        <div
          onClick={() => setSelectedKid("All")}
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: selectedKid === "All" ? "#111" : "#fff",
            color: selectedKid === "All" ? "#fff" : "#000",
            textAlign: "center",
            cursor: "pointer"
          }}
        >
          All
        </div>

        {kids.map(kid => (
          <div
            key={kid}
            onClick={() => setSelectedKid(kid)}
            style={{
              padding: "15px",
              borderRadius: "12px",
              background: kidColors[kid],
              color: "#fff",
              textAlign: "center",
              cursor: "pointer",
              opacity: selectedKid === kid ? 1 : 0.6
            }}
          >
            {kidIcons[kid]} {kid}
          </div>
        ))}
      </div>

      {/* ➕ ADD TILE */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
      }}>
        <input
          placeholder="New Chore"
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          style={{ marginRight: "10px", padding: "10px" }}
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{ marginRight: "10px", padding: "10px" }}
        >
          <option value="">Assign</option>
          {kids.map(kid => (
            <option key={kid} value={kid}>{kid}</option>
          ))}
        </select>

        <button onClick={addChore}>Add</button>
      </div>

      {/* 🧹 CHORE TILE GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "15px"
      }}>
        {chores
          .filter(c => selectedKid === "All" || c.assignedTo === selectedKid)
          .map((chore, index) => (
            <div
              key={index}
              onClick={() => toggleChore(index)}
              style={{
                padding: "20px",
                borderRadius: "16px",
                background: chore.done ? "#d1fae5" : "#fff",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                {chore.text}
              </div>

              <div style={{
                marginTop: "8px",
                fontSize: "14px",
                color: kidColors[chore.assignedTo]
              }}>
                {kidIcons[chore.assignedTo]} {chore.assignedTo}
              </div>

              <div style={{ marginTop: "10px", fontSize: "20px" }}>
                {chore.done ? "✅" : "⬜"}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
