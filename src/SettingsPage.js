import React, { useEffect, useState } from "react";

const API = "https://script.google.com/macros/s/AKfycbwu26ABWTuw9xG_u5DpT0-Ql-CZeiOw9qfB7ewDVN_zrsD3CiaX0_0XL__VyrASgdee/exec";

export default function SettingsPage() {
  const [active, setActive] = useState("family");

  return (
    <div className="settings-shell">

      {/* LEFT MENU */}
      <div className="settings-menu">

        <div
          className={`settings-menu-item ${active === "family" ? "active" : ""}`}
          onClick={() => setActive("family")}
        >
          Family Profiles
        </div>

        <div
          className={`settings-menu-item ${active === "network" ? "active" : ""}`}
          onClick={() => setActive("network")}
        >
          Network
        </div>

        <div
          className={`settings-menu-item ${active === "chores" ? "active" : ""}`}
          onClick={() => setActive("chores")}
        >
          Recurring Chores
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="settings-content">

        {active === "family" && <FamilyPage />}

        {active === "network" && <NetworkPage />}

        {active === "chores" && <RecurringChores />}

      </div>

    </div>
  );
} 


// 🔥 FAMILY PAGE (placeholder)
function FamilyPage() {
  return (
    <div>
      <h2>Family Profiles</h2>
      <div className="settings-card">
        Coming soon...
      </div>
    </div>
  );
}


// 🔥 NETWORK PAGE
function NetworkPage() {
  const [info, setInfo] = useState({
    ip: "Loading...",
    online: navigator.onLine,
    type: "Unknown",
    speed: "Unknown",
    device: navigator.userAgent
  });

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => {
        setInfo(prev => ({ ...prev, ip: data.ip }));
      });

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (connection) {
      setInfo(prev => ({
        ...prev,
        type: connection.effectiveType,
        speed: connection.downlink + " Mbps"
      }));
    }
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Network Info</h2>

      <div className="settings-card">

        <div className="settings-row">
          <div>Public IP</div>
          <div>{info.ip}</div>
        </div>

        <div className="settings-row">
          <div>Status</div>
          <div>{info.online ? "Online" : "Offline"}</div>
        </div>

        <div className="settings-row">
          <div>Connection</div>
          <div>{info.type}</div>
        </div>

        <div className="settings-row">
          <div>Speed</div>
          <div>{info.speed}</div>
        </div>

        <div className="settings-row">
          <div>Device</div>
          <div style={{ fontSize: "12px" }}>
            {info.device}
          </div>
        </div>

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

        <div className="settings-row settings-header">
          <div>Name</div>
          <div>Chore</div>
          <div></div>
        </div>

        {chores.map((c, i) => (
          <div key={i} className="settings-row">

            <input
              value={c.name}
              onChange={(e) => update(i, "name", e.target.value)}
            />

            <input
              value={c.chore}
              onChange={(e) => update(i, "chore", e.target.value)}
            />

            <button
              className="settings-delete"
              onClick={() => removeRow(i)}
            >
              ✕
            </button>

          </div>
        ))}

        <div className="settings-actions">
          <button onClick={addRow}>+ Add</button>
          <button onClick={save}>Save</button>
        </div>

      </div>

    </div>
  );
}
