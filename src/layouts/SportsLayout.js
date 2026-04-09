import React, { useState } from "react";
import SportsHomePage from "../Sports Mode/sportshomepage";
import sportsLogo from "../assets/sports-logo.png";
import { Settings, Home, Users, Calendar } from "lucide-react";

export default function SportsLayout() {
  const [page, setPage] = useState("home");

  const tiles = [
    { name: "Home", icon: <Home />, page: "home", color: "#7a1f1f" },
    { name: "Teams", icon: <Users />, page: "teams", color: "#991b1b" },
    { name: "Schedule", icon: <Calendar />, page: "schedule", color: "#b91c1c" },
  ];

  return (
    <div style={styles.container}>

      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        <img src={sportsLogo} style={styles.logo} />

        <div style={styles.settings}>
          <Settings size={20} />
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div style={styles.content}>
        {page === "home" && <SportsHomePage />}
        {page === "teams" && <div style={styles.pagePlaceholder}>Teams Page</div>}
        {page === "schedule" && <div style={styles.pagePlaceholder}>Schedule Page</div>}
      </div>

      {/* ===== DOCK ===== */}
      <div style={styles.dockWrapper}>
        <div style={styles.dockInner}>
          <div style={styles.dockGrid}>
            {tiles.map((tile, i) => (
              <div
                key={i}
                style={{
                  ...styles.dockItem,
                  background: tile.color,
                }}
                onClick={() => setPage(tile.page)}
              >
                {tile.icon}
                <div>{tile.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}


/* =========================
   🎨 STYLES (MATCH HOME)
========================= */

const styles = {
  container: {
    height: "100vh",
    width: "100vw",                 // ✅ FIX
    display: "flex",
    flexDirection: "column",
    position: "relative",
    background: "#eef1f5",
    overflow: "hidden",             // ✅ FIX
  },

  /* ===== HEADER ===== */
  header: {
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    height: "38px",
  },

  settings: {
    background: "#fff",
    padding: 8,
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },

  /* ===== CONTENT ===== */
  content: {
    padding: "10px 20px 120px",   // ✅ CRITICAL FIX (matches Home)
    height: "100%",
  },

  pagePlaceholder: {
    padding: "40px",
    textAlign: "center",
    fontSize: "20px",
    color: "#333",
  },

  /* ===== DOCK ===== */
  dockWrapper: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  dockInner: {
    width: "95%",
    maxWidth: "1400px",
    background: "#eef1f5",       // ✅ matches Home exactly
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "20px",
  },

  dockGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },

  dockItem: {
    color: "white",
    padding: "14px",
    borderRadius: "14px",
    textAlign: "center",
    cursor: "pointer",
    fontWeight: "600",
  },
};
