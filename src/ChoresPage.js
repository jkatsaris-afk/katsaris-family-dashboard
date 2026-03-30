import React, { useState } from "react";

export default function ChoresPage() {
  const [kids, setKids] = useState(["Sam", "Kade", "Ava"]);
  const [chores, setChores] = useState([]);

  const [newKid, setNewKid] = useState("");
  const [newChore, setNewChore] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const addKid = () => {
    if (newKid) {
      setKids([...kids, newKid]);
      setNewKid("");
    }
  };

  const addChore = () => {
    if (newChore && assignedTo) {
      setChores([
        ...chores,
        { text: newChore, assignedTo, done: false },
      ]);
      setNewChore("");
    }
  };

  const toggleChore = (index) => {
    const updated = [...chores];
    updated[index].done = !updated[index].done;
    setChores(updated);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chore List</h2>

      {/* Add Kid */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Add Kid"
          value={newKid}
          onChange={(e) => setNewKid(e.target.value)}
        />
        <button onClick={addKid}>Add Kid</button>
      </div>

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
            <option key={i} value={kid}>
              {kid}
            </option>
          ))}
        </select>

        <button onClick={addChore}>Add Chore</button>
      </div>

      {/* Chores */}
      {chores.map((chore, index) => (
        <div
          key={index}
          onClick={() => toggleChore(index)}
          style={{
            padding: "10px",
            marginBottom: "10px",
            background: chore.done ? "#d1fae5" : "#fff",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <strong>{chore.text}</strong> — {chore.assignedTo}
        </div>
      ))}
    </div>
  );
}
