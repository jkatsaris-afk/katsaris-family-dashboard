import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzcLAcdqWRlh3YnumUHW_tKJ3TA88uI7lPXA6K43TnzTrmZg802I4boZyp-1VOu7CUd/exec";

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

  // 🔥 LOAD + LIVE SYNC
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
        })
        .catch(err => console.error("Chore load error:", err));
    };

    loadData();
    const interval = setInterval(loadData, 5000);
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

    setChores(prev => [
      ...prev,
      {
        id: Date.now(),
        assignedTo: selectedKid,
        text: newChore,
        done: false,
        timestamp: null
      }
    ]);

    setNewChore("");
  };

  // ✅ TOGGLE (STABLE VERSION)
  const toggleChore = async (chore) => {
    const now = new Date();

    // instant UI update
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

      // 🔥 force sync AFTER write
      setTimeout(() => {
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
          });
      }, 500);

    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // 🔥 LOADING DOTS
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

      {/* ADD TILE */}
      <div style={{
        background: "#fff",
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
          <select value={selectedKid} onChange={(e) => setSelectedKid(e.target.value)}>
            {kids.map(k => <option key={k}>{k}</option>)}
          </select>

          <select
            value={isRecurring ? "recurring" : "one"}
            onChange={(e) => setIsRecurring(e.target.value === "recurring")}
          >
            <option value="one">One-Time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>

        <input
          placeholder="Enter chore..."
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <div onClick={addChore} style={{
          background: "#3b82f6",
          color: "#fff",
          textAlign: "center",
          padding: "10px",
          borderRadius: "10px",
          cursor: "pointer"
        }}>
          Add
        </div>
      </div>

      {/* BOARD */}
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
                padding: "16px",
                borderRadius: "14px",
                marginBottom: "12px",
                textAlign: "center",
                fontWeight: "700",
                background: allDone ? colors.complete : "#fff",
                color: allDone ? "#fff" : "#111",
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
                      background: chore.done ? colors.complete : colors.base,
                      color: chore.done ? "#fff" : "#111",
                      textAlign: "center",
                      cursor: "pointer"
                    }}
                  >
                    <div>{chore.text}</div>

                    {chore.done && (
                      <div style={{ fontSize: "12px" }}>
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
