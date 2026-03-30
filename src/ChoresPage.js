import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyX2N0YU9GUrn38IjUU4iucTq5dFQ4EcPaGjAnwcLMdMdNsNn2wq8Ni7McYSvj1vQQA/exec";

export default function ChoresPage() {
  const [kids] = useState(["Sam", "Kade", "Ava"]);
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
        })
        .catch(err => console.error("Chores load error:", err));
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

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontWeight: "600", marginBottom: "15px" }}>
        Chores
      </div>

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
            style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #ddd" }}
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ddd" }}
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

      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
      }}>
        {chores.map(chore => (
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
            <div>{chore.assignedTo}: {chore.text}</div>
            <div>{chore.done ? "✅" : "⬜"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
