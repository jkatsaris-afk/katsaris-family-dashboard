import React, { useState } from "react";
import SportsHomePage from "../Sports Mode/sportshomepage";
import sportsLogo from "../assets/sports-logo.png";
import { Settings, Home } from "lucide-react";

export default function SportsLayout() {
  const [page, setPage] = useState("home");

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <img src={sportsLogo} style={styles.logo} />

        <div style={styles.settings}>
          <Settings size={20} />
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        {page === "home" && <SportsHomePage />}
      </div>

      {/* DOCK */}
      <div style={styles.dock}>
        <div style={styles.dockItem} onClick={() => setPage("home")}>
          <Home />
          <div>Home</div>
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#eef1f5",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 20px",
  },
  logo: {
    height: "38px",
  },
  settings: {
    background: "#fff",
    padding: 8,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    padding: "10px 20px",
  },
  dock: {
    padding: "12px",
    display: "flex",
    justifyContent: "center",
  },
  dockItem: {
    background: "#7a1f1f",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
  },
};
