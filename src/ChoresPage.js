import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbwDALm53uXOwohhTF57V2hYN-KNuprGWQTQA-sQCupqbhTJCSyX1g-YTobL9s96yv6D/exec";

export default function ChoresPage() {
  const kids = ["Sam", "Kade", "Ava"];

  const kidColors = {
    Sam: "#dbeafe",
    Kade: "#dcfce7",
    Ava: "#fce7f3"
  };

  const [chores, setChores] = useState([]);

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
      });
  }, []);

  const formatTime = (date) => {
    if (!date) return "--";

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

  return (
    <div style={{ padding: "20px" }}>

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

              {/* 👦 NAME */}
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
                gap: "12px"
              }}>
                {kidChores.map(chore => {
                  const baseColor = kidColors[kid];

                  return (
                    <div
                      key={chore.id}
                      onClick={() => toggleChore(chore)}
                      style={{
                        padding: "18px",
                        borderRadius: "16px",
                        cursor: "pointer",
                        background: chore.done ? "#22c55e" : baseColor,
                        color: chore.done ? "#ffffff" : "#111827",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                        transition: "all 0.2s ease",
                        minHeight: "100px", // 👈 slightly smaller
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >

                      {/* TEXT */}
                      <div style={{
                        fontSize: "17px",
                        fontWeight: "600",
                        textAlign: "center"
                      }}>
                        {chore.text}
                      </div>

                      {/* STATUS */}
                      <div style={{
                        fontSize: "13px",
                        textAlign: "center",
                        opacity: 0.85
                      }}>
                        {chore.done ? "Complete" : "Not Complete"} • {formatTime(chore.timestamp)}
                      </div>

                    </div>
                  );
                })}

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
