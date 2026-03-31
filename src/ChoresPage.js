import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzevKeYvEzoBLT--KJzWgq3mty2nVjkklqIcHiJuNR3FM5bxBj0HOBnQsCN8J6n_MTu/exec";

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
          const today = new Date().toISOString().split("T")[0];

          const formatted = data.slice(1)
            .filter(row => row[4] === today)
            .map(row => ({
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

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>

      {/* ADD CHORE */}
      <div style={{
        background: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 20
      }}>
        <input
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
          placeholder="New chore"
          style={{ width: "100%", marginBottom: 10 }}
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {kids.map(kid => {
          const kidChores = chores.filter(c => c.assignedTo === kid);
          const complete = kidChores.filter(c => c.done).length;
          const total = kidChores.length;

          return (
            <div key={kid}>
              <div>{kid} ({complete}/{total})</div>

              {kidChores.map(chore => (
                <div
                  key={chore.id}
                  onClick={() => toggleChore(chore)}
                  style={{
                    padding: 12,
                    marginTop: 10,
                    borderRadius: 10,
                    background: chore.done
                      ? kidColors[kid].complete
                      : kidColors[kid].base,
                    color: chore.done ? "#fff" : "#000",
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
