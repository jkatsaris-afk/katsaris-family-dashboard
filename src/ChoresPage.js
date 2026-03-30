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

  // 🏆 LEADERBOARD
  const leaderboard = kids.map(kid => {
    const doneCount = chores.filter(c => c.assignedTo === kid && c.done).length;
    return { kid, doneCount };
  });

  const max = Math.max(...leaderboard.map(l => l.doneCount), 1);

  return (
    <div style={{ minHeight: "100vh", background: "#eef1f5" }}>

      <div style={{ padding: "20px" }}>

        {/* 🏆 LEADERBOARD */}
        <div style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
        }}>
          <div style={{
            marginBottom: "15px",
            fontWeight: "600"
          }}>
            🏆 Leaderboard
          </div>

          {leaderboard
            .sort((a, b) => b.doneCount - a.doneCount)
            .map((item, index) => {
              const width = (item.doneCount / max) * 100;
              const isTop = index === 0;

              return (
                <div key={item.kid} style={{ marginBottom: "12px" }}>
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: isTop ? "600" : "500"
                  }}>
                    <span>
                      {isTop ? "👑 " : ""}
                      {item.kid}
                    </span>
                    <span>{item.doneCount}</span>
                  </div>

                  <div style={{
                    height: "10px",
                    background: "#eee",
                    borderRadius: "999px"
                  }}>
                    <div style={{
                      width: `${width}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background: isTop
                        ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                        : `linear-gradient(90deg, ${kidColors[item.kid]}, #a5b4fc)`
                    }} />
                  </div>
                </div>
              );
            })}
        </div>

        {/* ➕ ADD CHORE CARD */}
        <div style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "18px",
          marginBottom: "20px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
        }}>
          <div style={{ fontWeight: "600", marginBottom: "10px" }}>
            Add Chore
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              placeholder="Enter chore..."
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
              <div style={{
                fontWeight: "600",
                marginBottom: "10px",
                color: kidColors[kid]
              }}>
                {kid}
              </div>

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
