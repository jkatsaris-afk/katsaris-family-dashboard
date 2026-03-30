import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyTHZiC1Tcghz0nyUvY8qRiUhcllQapC4OKIwzRS35gIq0eYVmBE7sXiNWhzctQJbVI/exec";

const kidColors = {
  Sam: "#3b82f6",
  Kade: "#10b981",
  Ava: "#ec4899"
};

export default function ChoresPage({ goHome }) {
  const [kids] = useState(["Sam", "Kade", "Ava"]);
  const [chores, setChores] = useState([]);

  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [selectedKid, setSelectedKid] = useState("All");

  // LOAD DATA
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
        });
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ADD
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

  // TOGGLE
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
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      padding: "20px"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <button onClick={goHome} style={{ marginRight: "15px" }}>
          ←
        </button>
        <h2 style={{ margin: 0 }}>Chores</h2>
      </div>

      {/* KID FILTER (clean pills) */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
      }}>
        {["All", ...kids].map(kid => (
          <div
            key={kid}
            onClick={() => setSelectedKid(kid)}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              background:
                selectedKid === kid
                  ? "#111"
                  : "#e5e7eb",
              color:
                selectedKid === kid
                  ? "#fff"
                  : "#000",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            {kid}
          </div>
        ))}
      </div>

      {/* ADD ROW (clean inline) */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
      }}>
        <input
          placeholder="New chore..."
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        >
          <option value="">Kid</option>
          {kids.map(k => (
            <option key={k}>{k}</option>
          ))}
        </select>

        <button onClick={addChore}>Add</button>
      </div>

      {/* CHORE CARDS */}
      {chores
        .filter(c => selectedKid === "All" || c.assignedTo === selectedKid)
        .map((chore, index) => (
          <div
            key={index}
            onClick={() => toggleChore(index)}
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "16px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}
          >
            <div>
              <div style={{
                fontWeight: "600",
                fontSize: "16px"
              }}>
                {chore.text}
              </div>

              <div style={{
                fontSize: "13px",
                marginTop: "4px",
                color: kidColors[chore.assignedTo]
              }}>
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
