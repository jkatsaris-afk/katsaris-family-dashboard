import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzhcPTLS8wpLA-4OQEbqd-05p6cBRcL-RRbLDxf5qGSc3cC_Iz_Vfv0E0qwV3XkcXRx/exec";

export default function ChoresPage() {
  const [kids, setKids] = useState(["Sam", "Kade", "Ava"]);
  const [chores, setChores] = useState([]);

  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // 🔥 LOAD DATA FROM GOOGLE SHEET
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const formatted = data.slice(1).map(row => ({
          text: row[1],
          assignedTo: row[0],
          done: row[2] === true || row[2] === "TRUE"
        }));
        setChores(formatted);
      })
      .catch(err => console.error("Load error:", err));
  }, []);

  // 🔥 ADD CHORE (SAVES TO GOOGLE SHEET)
  const addChore = () => {
    if (!newChore || !assignedTo) return;

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name: assignedTo,
        chore: newChore,
        done: false
      })
    });

    setChores([
      ...chores,
      { text: newChore, assignedTo, done: false }
    ]);

    setNewChore("");
  };

  // 🔥 TOGGLE DONE (LOCAL ONLY FOR NOW)
  const toggleChore = (index) => {
    const updated = [...chores];
    updated[index].done = !updated[index].done;
    setChores(updated);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chore List</h2>

      {/* Add Chore */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="New Chore"
          value={newChore}
          onChange={(e) => setNewChore(e.target.value)}
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign To</option>
          {kids.map((kid, i) => (
            <option key={i} value={kid}>{kid}</option>
          ))}
        </select>

        <button onClick={addChore}>Add</button>
      </div>

      {/* Chore List */}
      {chores.map((chore, index) => (
        <div
          key={index}
          onClick={() => toggleChore(index)}
          style={{
            padding: "12px",
            marginBottom: "10px",
            background: chore.done ? "#d1fae5" : "#fff",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <strong>{chore.text}</strong> — {chore.assignedTo}
        </div>
      ))}
    </div>
  );
}
