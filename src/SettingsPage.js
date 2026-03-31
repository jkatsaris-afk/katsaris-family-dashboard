import React, { useEffect, useState } from "react";

const API = "https://script.google.com/macros/s/AKfycbwu26ABWTuw9xG_u5DpT0-Ql-CZeiOw9qfB7ewDVN_zrsD3CiaX0_0XL__VyrASgdee/exec";

export default function SettingsPage() {
  const [active, setActive] = useState("chores");

  return (
    <div className="settings-shell">

      {/* LEFT MENU */}
      <div className="settings-menu">

        <div
          className={`settings-menu-item ${active === "chores" ? "active" : ""}`}
          onClick={() => setActive("chores")}
        >
          Recurring Chores
        </div>

        <div
          className={`settings-menu-item ${active === "family" ? "active" : ""}`}
          onClick={() => setActive("family")}
        >
          Family Profiles
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="settings-content">

        {active === "chores" && <RecurringChores />}

        {active === "family" && (
          <div>
            <h2>Family Profiles</h2>
            <div className="settings-card">
              Coming soon...
            </div>
          </div>
        )}

      </div>

    </div>
  );
}


// 🔥 CHORES EDITOR
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

  // 🔥 LOADING PANEL
  if (loading) {
    return (
      <div className="settings-loading">

        <div className="settings-spinner"></div>

        <div className="settings-loading-text">
          Checking on the Children
        </div>

        <div className="settings-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

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

      <div className="settings-card">

        {/* HEADER */}
        <div className="settings-row settings-header">
          <div>Name</div>
          <div>Chore</div>
          <div></div>
        </div>

        {/* LIST */}
        {chores.map((c, i) => (
          <div key={i} className="settings-row">

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

            <button
              className="settings-delete"
              onClick={() => removeRow(i)}
            >
              ✕
            </button>

          </div>
        ))}

        {/* ACTIONS */}
        <div className="settings-actions">
          <button onClick={addRow}>+ Add</button>
          <button onClick={save}>Save</button>
        </div>

      </div>

    </div>
  );
}
