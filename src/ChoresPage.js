import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyX2N0YU9GUrn38IjUU4iucTq5dFQ4EcPaGjAnwcLMdMdNsNn2wq8Ni7McYSvj1vQQA/exec";

export default function ChoresPage() {
  const kids = ["Sam", "Kade", "Ava"];

  const kidColors = {
    Sam: "#bfdbfe",
    Kade: "#bbf7d0",
    Ava: "#fbcfe8"
  };

  const [chores, setChores] = useState([]);
  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

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

  // 🏆 Leaderboard
  const leaderboard = kids.map(kid => {
    const score = chores.filter(c => c.assignedTo === kid && c.done).length;
    return { name: kid, score };
  }).sort((a, b) => b.score - a.score);

  const maxScore = Math.max(...leaderboard.map(p => p.score), 1);

  return (
    <div style={{ padding: "20px" }}>

      {/* 🏆 LEADERBOARD */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "20px",
        marginBottom: "20px",
        boxShadow: "0 8px 18px rgba(0,0,0,0.08)"
      }}>
        <div style={{ fontWeight: "700", marginBottom: "15px" }}>
          🏆 Leaderboard
        </div>

        {leaderboard.map((p, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              marginBottom: "4px"
            }}>
              <div>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {p.name}
              </div>
              <div>{p.score}</div>
            </div>

            {/* progress bar */}
            <div style={{
              height: "6px",
              background: "#e5e7eb",
              borderRadius: "6px"
            }}>
              <div style={{
                width: `${(p.score / maxScore) * 100}%`,
                height: "100%",
                background: "#3b82f6",
                borderRadius: "6px"
              }} />
            </div>

          </div>
        ))}
      </div>

      {/* ➕ ADD CHORE */}
      <div style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "20px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
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
        gap: "18px"
      }}>
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);

          return (
            <div key={kid} style={{
              background: kidColors[kid],
              padding: "18px",
              borderRadius: "20px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)"
            }}>
              {/* NAME */}
              <div style={{
                fontWeight: "700",
                marginBottom: "6px"
              }}>
                {kid}
              </div>

              {/* DIVIDER */}
              <div style={{
                height: "2px",
                background: "rgba(0,0,0,0.1)",
                marginBottom: "10px",
                borderRadius: "2px"
              }} />

              {/* TASKS */}
              {kidChores.map(chore => (
                <div
                  key={chore.id}
                  onClick={() => toggleChore(chore)}
                  style={{
                    padding: "10px",
                    marginBottom: "6px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    background: chore.done ? "#e5e7eb" : "#ffffff",
                    textDecoration: chore.done ? "line-through" : "none",
                    color: chore.done ? "#6b7280" : "#111827",
                    fontWeight: "500"
                  }}
                >
                  {chore.text}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
