import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbwu26ABWTuw9xG_u5DpT0-Ql-CZeiOw9qfB7ewDVN_zrsD3CiaX0_0XL__VyrASgdee/exec";

export default function ChoresPage() {
  const kids = ["Sam", "Kade", "Ava"];

  const kidColors = {
    Sam: { base: "#dbeafe", complete: "#3b82f6" },
    Kade: { base: "#dcfce7", complete: "#22c55e" },
    Ava: { base: "#fce7f3", complete: "#ec4899" },
  };

  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newChore, setNewChore] = useState("");
  const [selectedKid, setSelectedKid] = useState("Sam");
  const [isRecurring, setIsRecurring] = useState(false);

  // 🔥 LOAD + SYNC
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

  // 🕒 FORMAT TIME
  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // 🔥 STREAK
  const calculateStreak = (kid) => {
    const days = new Set(
      chores
        .filter(c => c.assignedTo === kid && c.done)
        .map(c => new Date(c.timestamp).toDateString())
    );
    return days.size;
  };

  // ➕ ADD
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
    const now = new Date();

    setChores(prev =>
      prev.map(c =>
        c.id === chore.id
          ? { ...c, done: !c.done, timestamp: now }
          : c
      )
    );

    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          update: true,
          id: chore.id,
          done: !chore.done
        }),
      });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // 🔥 LOADING
  const dotStyle = (delay) => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#9ca3af",
    animation: "bounce 1s infinite",
    animationDelay: `${delay}s`,
  });

  if (loading) {
    return (
      <div style={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "12px",
        fontSize: "20px",
        fontWeight: "600",
        color: "#6b7280",
      }}>
        <div>Get ready to clean!</div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={dotStyle(0)} />
          <div style={dotStyle(0.2)} />
          <div style={dotStyle(0.4)} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔥 STAT TILES */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "25px",
        marginBottom: "20px"
      }}>
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);
          const total = kidChores.length;
          const complete = kidChores.filter(c => c.done).length;
          const percent = total ? Math.round((complete / total) * 100) : 0;

          const colors = kidColors[kid];
          const streak = calculateStreak(kid);

          return (
            <div key={kid} style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.08)",
              textAlign: "center"
            }}>

              <div style={{ fontWeight: "700", marginBottom: "10px" }}>
                {kid}
              </div>

              {/* HALF GAUGE */}
              <div style={{
                width: "140px",
                height: "70px",
                margin: "0 auto",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: `conic-gradient(${colors.complete} ${percent * 1.8}deg, #e5e7eb 0deg)`
                }} />

                <div style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  position: "absolute",
                  top: "15px",
                  left: "15px"
                }} />

                <div style={{
                  position: "absolute",
                  bottom: "8px",
                  width: "100%",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: "700"
                }}>
                  {percent}%
                </div>
              </div>

              <div style={{
                marginTop: "10px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#6b7280"
              }}>
                🔥 {streak} day streak
              </div>

            </div>
          );
        })}
      </div>

      {/* 🔥 ADD TILE (UNCHANGED) */}
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "16px",
        marginBottom: "20px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}>
        <div style={{
          fontWeight: "700",
          marginBottom: "12px",
          textAlign: "center"
        }}>
          Add Chore
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "10px"
        }}>
          <select
            value={selectedKid}
            onChange={(e) => setSelectedKid(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb"
            }}
          >
            {kids.map(k => <option key={k}>{k}</option>)}
          </select>

          <select
            value={isRecurring ? "recurring" : "one"}
            onChange={(e) => setIsRecurring(e.target.value === "recurring")}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb"
            }}
          >
            <option value="one">One-Time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>

        <input
          placeholder="Enter chore..."
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            marginBottom: "10px"
          }}
        />

        <div
          onClick={addChore}
          style={{
            background: "#3b82f6",
            color: "#fff",
            textAlign: "center",
            padding: "12px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Add
        </div>
      </div>

      {/* 🔥 BOARD (UNCHANGED) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "25px",
      }}>
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);
          const total = kidChores.length;
          const complete = kidChores.filter(c => c.done).length;
          const allDone = total > 0 && complete === total;

          const colors = kidColors[kid];

          return (
            <div key={kid}>
              <div style={{
                padding: "14px",
                borderRadius: "14px",
                marginBottom: "12px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "18px",
                background: allDone ? colors.complete : "#ffffff",
                color: allDone ? "#ffffff" : "#111827",
                boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.08)"
              }}>
                {allDone
                  ? `🎉 ${kid} • ALL DONE! 🎉`
                  : `${kid} • ${complete}/${total}`
                }
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {kidChores.map(chore => (
                  <div
                    key={chore.id}
                    onClick={() => toggleChore(chore)}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      cursor: "pointer",
                      background: chore.done ? colors.complete : colors.base,
                      color: chore.done ? "#ffffff" : "#111827",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>
                      {chore.text}
                    </div>

                    {chore.done && (
                      <div style={{ fontSize: "12px", marginTop: "6px" }}>
                        Complete • {formatTime(chore.timestamp)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
