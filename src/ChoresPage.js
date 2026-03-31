import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbwDALm53uXOwohhTF57V2hYN-KNuprGWQTQA-sQCupqbhTJCSyX1g-YTobL9s96yv6D/exec";

export default function ChoresPage() {
  const kids = ["Sam", "Kade", "Ava"];

  const kidColors = {
    Sam: {
      base: "#dbeafe",
      complete: "#3b82f6",
    },
    Kade: {
      base: "#dcfce7",
      complete: "#22c55e",
    },
    Ava: {
      base: "#fce7f3",
      complete: "#ec4899",
    },
  };

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
          timestamp: null
        }));

        setChores(formatted);
      });
  }, []);

  // 🕒 FORMAT TIME
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ✅ TOGGLE
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                {kidChores.map(chore => {
                  const colors = kidColors[kid];

                  return (
                    <div
                      key={chore.id}
                      onClick={() => toggleChore(chore)}

                      // 🔥 CLICK ANIMATION
                      onMouseDown={(e) =>
                        (e.currentTarget.style.transform = "scale(0.97)")
                      }
                      onMouseUp={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }

                      style={{
                        padding: "16px",
                        borderRadius: "16px",
                        cursor: "pointer",
                        background: chore.done
                          ? colors.complete
                          : colors.base,
                        color: chore.done ? "#ffffff" : "#111827",

                        // 🔥 EDGE DEFINITION
                        border: chore.done
                          ? "2px solid transparent"
                          : "2px solid rgba(0,0,0,0.08)",

                        boxShadow: chore.done
                          ? "0 10px 20px rgba(0,0,0,0.15)"
                          : "0 4px 10px rgba(0,0,0,0.06)",

                        transition: "all 0.2s ease",

                        minHeight: "90px",

                        // 🔥 PERFECT CENTERING
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >

                      {/* 🔥 CHORE TEXT */}
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          lineHeight: "1.2",
                        }}
                      >
                        {chore.text}
                      </div>

                      {/* 🔥 STATUS (ONLY WHEN COMPLETE) */}
                      {chore.done && (
                        <div
                          style={{
                            fontSize: "12px",
                            marginTop: "6px",
                            opacity: 0.9,
                          }}
                        >
                          Complete • {formatTime(chore.timestamp)}
                        </div>
                      )}

                    </div>
                  );
                })}

                {/* EMPTY STATE */}
                {kidChores.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#9ca3af"
                    }}
                  >
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
