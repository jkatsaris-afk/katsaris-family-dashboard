import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbwDALm53uXOwohhTF57V2hYN-KNuprGWQTQA-sQCupqbhTJCSyX1g-YTobL9s96yv6D/exec";

export default function ChoresPage() {
  const kids = ["Sam", "Kade", "Ava"];

  const [chores, setChores] = useState([]);

  // 🔄 LOAD ONCE
  useEffect(() => {
    fetch(API_URL + "?type=chores")
      .then(res => res.json())
      .then(data => {
        const formatted = data.slice(1).map(row => ({
          id: row[0],
          assignedTo: row[1],
          text: row[2],
          done: row[3] === true || row[3] === "TRUE",
          timestamp: null // 👈 we’ll track locally
        }));

        setChores(formatted);
      });
  }, []);

  // 🕒 FORMAT TIME
  const formatTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ✅ TOGGLE
  const toggleChore = (chore) => {
    const now = new Date();

    // 🔥 instant UI update
    setChores(prev =>
      prev.map(c =>
        c.id === chore.id
          ? { ...c, done: !c.done, timestamp: now }
          : c
      )
    );

    // 🔥 send to backend
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

      {/* 🔥 STATUS BOARD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
        }}
      >
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);

          return (
            <div key={kid}>

              {/* 👦 HEADER */}
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "22px",
                  marginBottom: "12px",
                  textAlign: "center"
                }}
              >
                {kid}
              </div>

              {/* 🧱 TILES */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}>
                {kidChores.map(chore => (
                  <div
                    key={chore.id}
                    onClick={() => toggleChore(chore)}
                    style={{
                      padding: "22px",
                      borderRadius: "18px",
                      cursor: "pointer",
                      background: chore.done ? "#22c55e" : "#ffffff",
                      color: chore.done ? "#ffffff" : "#111827",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: "120px", // 🔥 bigger tiles
                    }}
                  >

                    {/* CHORE TEXT */}
                    <div style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      textAlign: "center"
                    }}>
                      {chore.text}
                    </div>

                    {/* STATUS BAR */}
                    <div style={{
                      marginTop: "15px",
                      fontSize: "13px",
                      opacity: 0.9,
                      textAlign: "center"
                    }}>
                      {chore.done ? "✅ Complete" : "⬜ Not Complete"}  
                      {" • "}
                      {formatTime(chore.timestamp)}
                    </div>

                  </div>
                ))}

                {kidChores.length === 0 && (
                  <div style={{
                    textAlign: "center",
                    color: "#9ca3af"
                  }}>
                    No chores
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
