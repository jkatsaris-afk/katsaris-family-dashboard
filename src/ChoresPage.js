import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbwDALm53uXOwohhTF57V2hYN-KNuprGWQTQA-sQCupqbhTJCSyX1g-YTobL9s96yv6D/exec";

export default function ChoresPage() {
  const kids = ["Sam", "Kade", "Ava"];

  const [chores, setChores] = useState([]);

  // 🔄 LOAD
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
            date: row[4]
          }));

          const today = new Date().toDateString();

          const todays = formatted.filter(c => {
            if (!c.date) return true;
            return new Date(c.date).toDateString() === today;
          });

          setChores(todays);
        });
    };

    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  // ✅ TOGGLE
  const toggleChore = (chore) => {
    // instant UI update
    setChores(prev =>
      prev.map(c =>
        c.id === chore.id ? { ...c, done: !c.done } : c
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

      {/* 🔥 BOARD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);

          return (
            <div key={kid}>

              {/* 👦 NAME HEADER */}
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "20px",
                  marginBottom: "10px",
                  textAlign: "center"
                }}
              >
                {kid}
              </div>

              {/* 🧱 CHORE TILES */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {kidChores.map(chore => (
                  <div
                    key={chore.id}
                    onClick={() => toggleChore(chore)}
                    style={{
                      padding: "18px",
                      borderRadius: "16px",
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "16px",
                      background: chore.done ? "#22c55e" : "#ffffff",
                      color: chore.done ? "#ffffff" : "#111827",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {chore.text}
                  </div>
                ))}

                {kidChores.length === 0 && (
                  <div style={{
                    color: "#9ca3af",
                    textAlign: "center",
                    fontSize: "14px"
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
