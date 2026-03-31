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
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    fetch(API + "?type=template")
      .then(res => res.json())
      .then(data => {
        const cleaned = data.slice(1).map(row => ({
          name: row[0] || "",
          chore: row[1] || ""
        }));

        setChores(cleaned);

        setTimeout(() => {
          setLoading(false);
          setFadeIn(true);
        }, 400);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔥 LOADING SCREEN (MATCHED STYLE)
  if (loading) {
    return (
      <div className="loading-screen">

        <div className="spinner"></div>

        <div className="loading-text">
          Checking on the Children’s Workload
        </div>

        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <style>{`
          .loading-screen {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
            gap: 15px;
          }

          /* SPINNER */
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #ddd;
            border-top: 4px solid #111;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          /* TEXT */
          .loading-text {
            font-size: 20px;
            font-weight: 500;
            color: #333;
          }

          /* DOTS BELOW TEXT */
          .dots {
            display: flex;
            gap: 6px;
          }

          .dots span {
            width: 8px;
            height: 8px;
            background: #333;
            border-radius: 50%;
            animation: dotPulse 1.4s infinite ease-in-out;
          }

          .dots span:nth-child(1) { animation-delay: 0s; }
          .dots span:nth-child(2) { animation-delay: 0.2s; }
          .dots span:nth-child(3) { animation-delay: 0.4s; }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes dotPulse {
            0%, 80%, 100% {
              transform: scale(0.5);
              opacity: 0.3;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
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
    <div className={fadeIn ? "fade-in" : ""}>

      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

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

            <button className="delete" onClick={() => removeRow(i)}>✕</button>

          </div>
        ))}

        <div className="actions">
          <button onClick={addRow}>+ Add</button>
          <button onClick={save}>Save</button>
        </div>

      </div>

      <style>{`
        .fade-in {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

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
