import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycby3gJ-hEDBneSWVT_pEGZsD2VjQ_8Qd-fuwXcVkFlBPYnCQVHHhbjeBDBL880zas3I8/exec";

export default function ChoresPage() {
  const kids = ["Sam", "Kade", "Ava"];

  const kidColors = {
    Sam: { base: "#bfdbfe", complete: "#1d4ed8" },
    Kade: { base: "#bbf7d0", complete: "#15803d" },
    Ava: { base: "#fbcfe8", complete: "#be185d" },
  };

  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newChore, setNewChore] = useState("");
  const [selectedKid, setSelectedKid] = useState("Sam");
  const [isRecurring, setIsRecurring] = useState(false);

  // 🔥 LOAD DATA
  useEffect(() => {
    const loadData = () => {
      fetch(API_URL + "?type=chores")
        .then(res => res.json())
        .then(data => {
          const formatted = data.slice(1).map(row => ({
            id: row[0],
            assignedTo: row[1],
            text: row[2],
            done: row[3] === true || row[3] === "TRUE",
            timestamp: row[4] ? new Date(row[4]) : null
          }));

          setChores(formatted);
          setLoading(false);
        });
    };

    loadData();

    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 CALCULATE STREAK (basic version)
  const calculateStreak = (kid) => {
    const dates = [...new Set(
      chores
        .filter(c => c.assignedTo === kid && c.done)
        .map(c => c.timestamp?.toDateString())
    )].filter(Boolean);

    return dates.length;
  };

  // ➕ ADD CHORE
  const addChore = () => {
    if (!newChore) return;

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name: selectedKid,
        chore: newChore,
        recurring: isRecurring
      }),
    });

    setNewChore("");
  };

  // ✅ TOGGLE
  const toggleChore = async (chore) => {
    setChores(prev =>
      prev.map(c =>
        c.id === chore.id
          ? { ...c, done: !c.done }
          : c
      )
    );

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        update: true,
        id: chore.id,
        done: !chore.done
      }),
    });
  };

  // 🔥 LOADING
  if (loading) {
    return (
      <div style={{
        height: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        fontWeight: "600",
      }}>
        Get ready to clean!
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔥 STATS TILE */}
      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.08)"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          textAlign: "center"
        }}>
          {kids.map(kid => {
            const kidChores = chores.filter(c => c.assignedTo === kid);
            const total = kidChores.length;
            const complete = kidChores.filter(c => c.done).length;
            const percent = total ? Math.round((complete / total) * 100) : 0;

            const streak = calculateStreak(kid);
            const colors = kidColors[kid];

            return (
              <div key={kid}>

                <div style={{ fontWeight: "700", marginBottom: "10px" }}>
                  {kid}
                </div>

                {/* Circle */}
                <div style={{
                  width: "90px",
                  height: "90px",
                  margin: "0 auto",
                  borderRadius: "50%",
                  background: `conic-gradient(${colors.complete} ${percent}%, #e5e7eb ${percent}%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "18px"
                }}>
                  {percent}%
                </div>

                <div style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#6b7280"
                }}>
                  🔥 {streak} day streak
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 🔥 ADD CHORE TILE */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "16px",
        marginBottom: "20px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.08)"
      }}>
        <div style={{
          fontWeight: "700",
          marginBottom: "12px",
          textAlign: "center"
        }}>
          Add Chore
        </div>

        <input
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          placeholder="Enter chore..."
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <select
            value={selectedKid}
            onChange={(e) => setSelectedKid(e.target.value)}
            style={{ flex: 1 }}
          >
            {kids.map(k => <option key={k}>{k}</option>)}
          </select>

          <select
            value={isRecurring ? "recurring" : "one"}
            onChange={(e) => setIsRecurring(e.target.value === "recurring")}
            style={{ flex: 1 }}
          >
            <option value="one">One-Time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>

        <div
          onClick={addChore}
          style={{
            background: "#3b82f6",
            color: "#fff",
            textAlign: "center",
            padding: "10px",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Add
        </div>
      </div>

      {/* 🔥 BOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
      }}>
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);
          const colors = kidColors[kid];

          return (
            <div key={kid}>
              <div style={{
                textAlign: "center",
                fontWeight: "700",
                marginBottom: "10px"
              }}>
                {kid}
              </div>

              {kidChores.map(chore => (
                <div
                  key={chore.id}
                  onClick={() => toggleChore(chore)}
                  style={{
                    background: chore.done ? colors.complete : colors.base,
                    color: chore.done ? "#fff" : "#000",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "10px",
                    textAlign: "center",
                    cursor: "pointer"
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
