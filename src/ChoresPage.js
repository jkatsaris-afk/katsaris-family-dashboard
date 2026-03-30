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
  const toggleChore = (chore) => {
    const updated = chores.map(c =>
      c.id === chore.id ? { ...c, done: !c.done } : c
    );

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        update: true,
        id: chore.id,
        done: !chore.done
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

      {/* ADD CHORE (simple) */}
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

      {/* 👇 DASHBOARD BY KID */}
      {kids.map(kid => {
        const kidChores = chores.filter(c => c.assignedTo === kid);

        return (
          <div
            key={kid}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.06)"
            }}
          >
            {/* KID HEADER */}
            <div style={{
              fontWeight: "600",
              fontSize: "18px",
              marginBottom: "15px",
              color: kidColors[kid]
            }}>
              {kid}
            </div>

            {/* CHORES */}
            {kidChores.length === 0 && (
              <div style={{ color: "#999" }}>
                No chores
              </div>
            )}

            {kidChores.map(chore => (
              <div
                key={chore.id}
                onClick={() => toggleChore(chore)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer"
                }}
              >
                <div>{chore.text}</div>

                <div style={{ fontSize: "18px" }}>
                  {chore.done ? "✅" : "⬜"}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
