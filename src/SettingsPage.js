import React, { useState } from "react";

export default function SettingsPage() {
  const [page, setPage] = useState("main");

  return (
    <div style={{ padding: "30px", background: "#f5f5f5", minHeight: "100vh" }}>

      {page === "main" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px"
        }}>

          {/* RECURRING CHORES TILE */}
          <div
            className="card"
            onClick={() => setPage("chores")}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <div style={{ fontSize: "18px" }}>Recurring Chores</div>
          </div>

        </div>
      )}

      {page === "chores" && <RecurringChores />}

      <style>{`
        .card {
          background: #121212;
          color: white;
          padding: 30px;
          border-radius: 20px;
        }
      `}</style>

    </div>
  );
}
function RecurringChores() {
  const [chores, setChores] = useState([
    "Take out trash",
    "Do dishes",
    "Clean room"
  ]);

  const updateChore = (index, value) => {
    const updated = [...chores];
    updated[index] = value;
    setChores(updated);
  };

  const addChore = () => {
    setChores([...chores, ""]);
  };

  const removeChore = (index) => {
    setChores(chores.filter((_, i) => i !== index));
  };

  const saveChores = async () => {
    await fetch("YOUR_SCRIPT_URL", {
      method: "POST",
      body: JSON.stringify({ chores }),
    });

    alert("Saved!");
  };

  return (
    <div>

      <h2>Recurring Chores</h2>

      {chores.map((chore, i) => (
        <div key={i} style={{ display: "flex", marginBottom: "10px" }}>
          <input
            value={chore}
            onChange={(e) => updateChore(i, e.target.value)}
            style={{ flex: 1, padding: "10px" }}
          />
          <button onClick={() => removeChore(i)}>X</button>
        </div>
      ))}

      <button onClick={addChore}>+ Add</button>
      <button onClick={saveChores}>Save</button>

    </div>
  );
}
