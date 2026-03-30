import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyX2N0YU9GUrn38IjUU4iucTq5dFQ4EcPaGjAnwcLMdMdNsNn2wq8Ni7McYSvj1vQQA/exec";

export default function ChoresPage() {
  const kids = ["Sam", "Kade", "Ava"];

  const [chores, setChores] = useState([]);
  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // 🔄 LOAD CHORES
  useEffect(() => {
    const loadData = () => {
      fetch(API_URL + "?type=chores")
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
    const interval = setInterval(loadData, 4000);
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
      }),
    });

    setNewChore("");
  };

  // ✅ TOGGLE
  const toggleChore = (chore) => {
    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        update: true,
        id: chore.id,
        done: !chore.done
      }),
    });
  };

  // 🏆 LEADERBOARD
  const leaderboard = kids.map(kid => {
    const score = chores.filter(c => c.assignedTo === kid && c.done).length;
    return { name: kid, score };
  }).sort((a, b) => b.score - a.score);

  return (
    <div style={{ padding: "20px" }}>

      {/* 🏆 LEADERBOARD */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "20px",
        marginBottom: "20px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
      }}>
        <div style={{ fontWeight: "600", marginBottom: "10px" }}>
          Leaderboard
        </div>

        {leaderboard.map((p, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px 0"
          }}>
            <div>
              {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {p.name}
            </div>
            <div>{p.score}</div>
          </div>
        ))}
      </div>

      {/* ➕ ADD CHORE */}
      <div style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Chore..."
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
            {kids.map(k => <option key={k}>{k}</option>)}
          </select>

          <button onClick={addChore} style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "none",
            background: "#3b82f6",
            color: "#fff"
          }}>
            Add
          </button>
        </div>
      </div>

      {/* 👦 KID TILES */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "15px"
      }}>
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);

          return (
            <div key={kid} style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "18px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
            }}>
              <div style={{
                fontWeight: "600",
                marginBottom: "10px"
              }}>
                {kid}
              </div>

              {kidChores.map(chore => (
                <div
                  key={chore.id}
                  onClick={() => toggleChore(chore)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    cursor: "pointer"
                  }}
                >
                  <div style={{
                    textDecoration: chore.done ? "line-through" : "none",
                    color: chore.done ? "#999" : "#000"
                  }}>
                    {chore.text}
                  </div>

                  <div>{chore.done ? "✅" : "⬜"}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
