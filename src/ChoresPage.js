import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbwDALm53uXOwohhTF57V2hYN-KNuprGWQTQA-sQCupqbhTJCSyX1g-YTobL9s96yv6D/exec";

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

  // 🔄 LOAD
  useEffect(() => {
    fetch(API_URL + "?type=chores")
      .then(res => res.json())
      .then(data => {
        const formatted = data.slice(1).map(row => ({
          id: row[0],
          assignedTo: row[1],
          text: row[2],
          done: row[3] === true || row[3] === "TRUE",
          timestamp: null
        }));

        setChores(formatted);
        setLoading(false);
      });
  }, []);

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const toggleChore = (chore) => {
    const now = new Date();

    setChores(prev =>
      prev.map(c =>
        c.id === chore.id
          ? { ...c, done: !c.done, timestamp: now }
          : c
      )
    );

    fetch(API_URL, {
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
      <div style={{ padding: "40px", textAlign: "center" }}>
        Get ready to clean!
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔥 GRID WRAPPER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
        }}
      >

        {/* 🔥 FULL WIDTH ADD TILE */}
        <div
          style={{
            gridColumn: "span 3",
            background: "#ffffff",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >

          <div style={{
            fontWeight: "700",
            marginBottom: "10px",
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
                border: "1px solid #ddd"
              }}
            >
              {kids.map(k => <option key={k}>{k}</option>)}
            </select>

            <select
              value={isRecurring ? "recurring" : "one"}
              onChange={(e) =>
                setIsRecurring(e.target.value === "recurring")
              }
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ddd"
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
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              marginBottom: "10px"
            }}
          />

          <div
            onClick={() => {
              if (!newChore) return;

              fetch(API_URL, {
                method: "POST",
                body: JSON.stringify({
                  add: true,
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
            }}
            style={{
              background: "#3b82f6",
              color: "#fff",
              textAlign: "center",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Add
          </div>

        </div>

        {/* 🔥 KID COLUMNS */}
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);
          const total = kidChores.length;
          const complete = kidChores.filter(c => c.done).length;
          const allDone = total > 0 && complete === total;
          const colors = kidColors[kid];

          return (
            <div key={kid}>

              {/* HEADER */}
              <div style={{
                padding: "14px",
                borderRadius: "14px",
                marginBottom: "12px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "18px",
                background: allDone ? colors.complete : "#ffffff",
                color: allDone ? "#ffffff" : "#111827",
              }}>
                {kid} • {complete}/{total}
              </div>

              {/* TILES */}
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
                    {chore.text}
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
