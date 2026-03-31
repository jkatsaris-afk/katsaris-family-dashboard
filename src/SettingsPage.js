import React, { useEffect, useState } from "react";

const API = "https://script.google.com/macros/s/AKfycbwu26ABWTuw9xG_u5DpT0-Ql-CZeiOw9qfB7ewDVN_zrsD3CiaX0_0XL__VyrASgdee/exec";

export default function SettingsPage() {
  const [active, setActive] = useState("chores");

  return (
    <div className="settings-shell">

      {/* LEFT MENU */}
      <div className="menu">

        <div
          className={`menu-item ${active === "chores" ? "active" : ""}`}
          onClick={() => setActive("chores")}
        >
          Recurring Chores
        </div>

        <div className="menu-item">Shopping (soon)</div>
        <div className="menu-item">Users (soon)</div>

      </div>

      {/* RIGHT CONTENT */}
      <div className="content">
        {active === "chores" && <RecurringChores />}
      </div>

      {/* STYLES */}
      <style>{`
        .settings-shell {
          display: flex;
          height: 100vh;
          background: #f5f5f5;
        }

        /* LEFT SIDE */
        .menu {
          width: 260px;
          background: white;
          padding: 20px;
          border-right: 1px solid #eee;
        }

        .menu-item {
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 10px;
          cursor: pointer;
          background: #f3f3f3;
          transition: all 0.2s;
        }

        .menu-item:hover {
          background: #e5e5e5;
        }

        .menu-item.active {
          background: #111;
          color: white;
        }

        /* RIGHT SIDE */
        .content {
          flex: 1;
          padding: 30px;
        }
      `}</style>

    </div>
  );
}


// 🔥 CHORES EDITOR (RIGHT SIDE)
function RecurringChores() {
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
      <div className="loading">

        <div className="spinner"></div>

        <div>Checking on the Children’s Workload</div>

        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <style>{`
          .loading {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #ddd;
            border-top: 4px solid #111;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .dots {
            display: flex;
            gap: 6px;
          }

          .dots span {
            width: 8px;
            height: 8px;
            background: #333;
            border-radius: 50%;
            animation: pulse 1.4s infinite;
          }

          .dots span:nth-child(2) { animation-delay: 0.2s; }
          .dots span:nth-child(3) { animation-delay: 0.4s; }

          @keyframes spin {
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
            40% { transform: scale(1); opacity: 1; }
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

      <h2 style={{ marginBottom: "20px" }}>Recurring Chores</h2>

      <div className="card">

        <div className="row header">
          <div>Name</div>
          <div>Chore</div>
          <div></div>
        </div>

        {chores.map((c, i) => (
          <div key={i} className="row">

            <input
              value={c.name}
              onChange={(e) => update(i, "name", e.target.value)}
            />

            <input
              value={c.chore}
              onChange={(e) => update(i, "chore", e.target.value)}
            />

            <button onClick={() => removeRow(i)}>✕</button>

          </div>
        ))}

        <div className="actions">
          <button onClick={addRow}>+ Add</button>
          <button onClick={save}>Save</button>
        </div>

      </div>

      <style>{`
        .card {
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          gap: 10px;
          margin-bottom: 10px;
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
