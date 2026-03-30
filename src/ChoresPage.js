import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyTHZiC1Tcghz0nyUvY8qRiUhcllQapC4OKIwzRS35gIq0eYVmBE7sXiNWhzctQJbVI/exec";

const kidColors = {
  Sam: "#4f8cff",
  Kade: "#4cc38a",
  Ava: "#b96bff"
};

export default function ChoresPage() {
  const [kids] = useState(["Sam", "Kade", "Ava"]);
  const [chores, setChores] = useState([]);

  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // LOAD
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
    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        update: true,
        id: chore.id,
        done: !chore.done
      })
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#eef1f5"
    }}>

      {/* 🔥 ADD CHORE CARD */}
      <div style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "18px",
        marginBottom: "20px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
      }}>
        <div style={{
          fontWeight: "600",
          marginBottom: "10px"
        }}>
          Add Chore
        </div>

        <div style={{
          display: "flex",
          gap: "10px"
        }}>
          <input
            placeholder="Enter chore..."
            value={newChore}
            onChange={(e) => setNewChore(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "14px"
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

          <button
            onClick={addChore}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: "#4f8cff",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* 👇 KID DASHBOARD */}
      <div style={{ padding: "0 20px 20px" }}>
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);
          const done = kidChores.filter(c => c.done).length;
          const total = kidChores.length;
          const percent = total ? (done / total) * 100 : 0;

          return (
            <div key={kid} style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
            }}>

              {/* NAME */}
              <div style={{
                fontWeight: "600",
                marginBottom: "10px",
                color: kidColors[kid]
              }}>
                {kid}
              </div>

              {/* PROGRESS */}
              <div style={{
                height: "8px",
                background: "#eee",
                borderRadius: "10px",
                marginBottom: "10px"
              }}>
                <div style={{
                  width: `${percent}%`,
                  height: "100%",
                  background: kidColors[kid],
                  borderRadius: "10px"
                }} />
              </div>

              <div style={{ fontSize: "13px", marginBottom: "10px" }}>
                {done} / {total} completed
              </div>

              {/* CHORES */}
              {kidChores.map(chore => (
                <div
                  key={chore.id}
                  onClick={() => toggleChore(chore)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    cursor: "pointer"
                  }}
                >
                  <div>{chore.text}</div>
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
