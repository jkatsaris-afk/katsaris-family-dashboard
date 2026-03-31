import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzevKeYvEzoBLT--KJzWgq3mty2nVjkklqIcHiJuNR3FM5bxBj0HOBnQsCN8J6n_MTu/exec";

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

  // 🔥 LOAD ONLY (NO FILTER / NO RESET)
  useEffect(() => {
    const loadData = () => {
      fetch(API_URL + "?type=chores")
        .then(res => res.json())
        .then(data => {
          const formatted = data.slice(1).map(row => ({
            id: row[0],
            assignedTo: row[1],
            text: row[2],
            done: row[3] === true || row[3] === "TRUE"
          }));

          setChores(formatted);
          setLoading(false);
        });
    };

    loadData();
  }, []);

  // ➕ ADD
  const addChore = () => {
    if (!newChore) return;

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name: selectedKid,
        chore: newChore,
        done: false
      }),
    });

    setNewChore("");
  };

  // ✅ TOGGLE
  const toggleChore = (chore) => {
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

  // 🔥 LOADING SCREEN (RESTORED)
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

      {/* ADD BOX */}
      <div style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "20px"
      }}>
        <input
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          placeholder="Add chore..."
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <select
          value={selectedKid}
          onChange={(e) => setSelectedKid(e.target.value)}
        >
          {kids.map(k => <option key={k}>{k}</option>)}
        </select>

        <button onClick={addChore}>Add</button>
      </div>

      {/* BOARD */}
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
