import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyTHZiC1Tcghz0nyUvY8qRiUhcllQapC4OKIwzRS35gIq0eYVmBE7sXiNWhzctQJbVI/exec";

export default function ChoresPage({ goHome }) {
  const [kids] = useState(["Sam", "Kade", "Ava"]);
  const [chores, setChores] = useState([]);

  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [selectedKid, setSelectedKid] = useState("All");

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

      <h1 style={{ marginBottom: "20px" }}>Chore Dashboard</h1>

      {/* 👦 KID FILTER */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setSelectedKid("All")}>All</button>
        {kids.map((kid, i) => (
          <button key={i} onClick={() => setSelectedKid(kid)}>
            {kid}
          </button>
        ))}
      </div>

      {/* ➕ ADD CHORE */}
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

      {/* 🏆 POINTS */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Points</h3>
        {kids.map(kid => {
          const total = chores
            .filter(c => c.assignedTo === kid)
            .reduce((sum, c) => sum + (c.points || 0), 0);

          return (
            <div key={kid}>
              {kid}: {total}
            </div>
          );
        })}
      </div>

      {/* 📋 CHORES */}
      {chores
        .filter(c => selectedKid === "All" || c.assignedTo === selectedKid)
        .map((chore, index) => (
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

            <div>
              {chore.done ? "✅" : "⬜"}
            </div>
          </div>
        ))}
    </div>
  );
}
