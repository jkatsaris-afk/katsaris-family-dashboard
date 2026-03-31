import React, { useEffect, useState } from "react";

const API = "https://script.google.com/macros/s/AKfycbwu26ABWTuw9xG_u5DpT0-Ql-CZeiOw9qfB7ewDVN_zrsD3CiaX0_0XL__VyrASgdee/exec";

export default function SettingsPage() {
  const [page, setPage] = useState("main");

  return (
    <div style={{
      background: "#f5f5f5",
      minHeight: "100vh",
      padding: "30px"
    }}>

      {/* MAIN TILE PAGE */}
      {page === "main" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          <div className="card" onClick={() => setPage("chores")}>
            <h3>Recurring Chores</h3>
          </div>
        </div>
      )}

      {/* CHORES EDITOR */}
      {page === "chores" && (
        <RecurringChores goBack={() => setPage("main")} />
      )}

      <style>{`
        .card {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          cursor: pointer;
          text-align: center;
          font-weight: 600;
        }
      `}</style>

    </div>
  );
}


// 🔥 CHORE EDITOR
function RecurringChores({ goBack }) {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API + "?type=template")
      .then(res => res.json())
      .then(data => {
        const cleaned = data.slice(1).map(row => ({
          name: row[0] || "",
          chore: row[1] || ""
        }));

        setChores(cleaned);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔥 LOADING SCREEN
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">
          Checking on the Children’s Workload
          <span className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>

        <style>{`
          .loading-screen {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
          }

          .loading-text {
            font-size: 20px;
            font-weight: 500;
            color: #333;
          }

          .dots span {
            animation: bounce 1.4s infinite;
            display: inline-block;
            margin-left: 3px;
          }

          .dots span:nth-child(2) {
            animation-delay: 0.2s;
          }

          .dots span:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  const update = (i, field, value) => {
    const updated = [...chores];
    updated[i][field] = value;
    setChores(updated);
  };

  const addRow = () => {
    setChores([...chores, { name: "", chore: "" }]);
  };

  const removeRow = (i) => {
    setChores(chores.filter((_, index) => index !== i));
  };

  const save = async () => {
    await fetch(API, {
      method: "POST",
      body: JSON.stringify({
        saveTemplate: true,
        chores: chores
      })
    });

    alert("Saved!");
  };

  return (
    <div>

      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      <h2 style={{ marginBottom: "20px" }}>Recurring Chores</h2>

      <div className="card">

        {/* HEADER */}
        <div className="row header">
          <div>Name</div>
          <div>Chore</div>
          <div></div>
        </div>

        {/* LIST */}
        {chores.map((c, i) => (
          <div key={i} className="row">

            <input
              value={c.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Name"
            />

            <input
              value={c.chore}
              onChange={(e) => update(i, "chore", e.target.value)}
              placeholder="Chore"
            />

            <button className="delete" onClick={() => removeRow(i)}>✕</button>

          </div>
        ))}

        {/* ACTIONS */}
        <div className="actions">
          <button onClick={addRow}>+ Add</button>
          <button onClick={save}>Save</button>
        </div>

      </div>

      <style>{`
        .card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }

        .header {
          font-weight: 600;
          opacity: 0.6;
          margin-bottom: 15px;
        }

        input {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        button {
          padding: 8px 12px;
          border-radius: 10px;
          border: none;
          background: #111;
          color: white;
          cursor: pointer;
        }

        .delete {
          background: #e11d48;
        }

        .actions {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }
      `}</style>

    </div>
  );
}
