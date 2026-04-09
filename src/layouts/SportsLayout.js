import React, { useState } from "react";
import SportsHomePage from "../Sports Mode/sportshomepage";
import sportsLogo from "../assets/sports-logo.png";
import { Settings, Home } from "lucide-react";

export default function SportsLayout() {
  const [page, setPage] = useState("home");

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
      </div>

      {/* ===== DOCK ===== */}
      <div style={styles.dockWrapper}>
        <div style={styles.dockInner}>
          <div style={styles.dockGrid}>
            <div style={styles.dockItem} onClick={() => setPage("home")}>
              <Home />
              <div>Home</div>
            </div>
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
    display: "flex",
    flexDirection: "column",
    position: "relative",
    background: "#eef1f5",
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
    padding: "10px 20px 120px", // 🔥 matches Home spacing exactly
    height: "100%",
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
    background: "#eef1f5",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "20px",
  },

  dockGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "12px",
  },

  dockItem: {
    background: "#7a1f1f", // 🔥 sports theme color
    color: "white",
    padding: "14px",
    borderRadius: "14px",
    textAlign: "center",
    cursor: "pointer",
  },
};
