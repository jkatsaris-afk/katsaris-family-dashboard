// ===== BLOCK 1: IMPORTS =====
import React, { useState } from "react";
import { motion } from "framer-motion";

// LOGOS
import homeLogo from "../assets/oikos-brand.png"; // ✅ UPDATED
import businessLogo from "../assets/businesslogo.png";
import eduLogo from "../assets/edulogo.png";
import tvLogo from "../assets/tvlogo.png";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 2: COMPONENT =====
export default function ModeSettings() {

  // ===== BLOCK 3: STATE =====
  const [selectedMode, setSelectedMode] = useState("home");


  // ===== BLOCK 4: MODE CONFIG =====
  const modes = [
    { key: "home", name: "Home", logo: homeLogo },
    { key: "business", name: "Business", logo: businessLogo },
    { key: "education", name: "Education", logo: eduLogo },
    { key: "tv", name: "TV", logo: tvLogo },
  ];


  // ===== BLOCK 5: UI =====
  return (
    <div style={styles.container}>

      {/* TITLE */}
      <h2 style={styles.title}>Mode Settings</h2>

      {/* MODE GRID */}
      <div style={styles.grid}>
        {modes.map((mode) => {
          const active = selectedMode === mode.key;

          return (
            <motion.div
              key={mode.key}
              onClick={() => setSelectedMode(mode.key)}
              whileTap={{ scale: 0.97 }}
              style={{
                ...styles.card,
                border: active ? `2px solid ${PRIMARY}` : "2px solid transparent",
                background: active ? "#eef6ff" : "#fff",
              }}
            >

              {/* LOGO */}
              <img
                src={mode.logo}
                alt={mode.name}
                style={styles.logo}
              />

              {/* NAME */}
              <div style={styles.name}>{mode.name}</div>

              {/* TOGGLE */}
              <div
                style={{
                  ...styles.toggle,
                  background: active ? PRIMARY : "#ddd",
                }}
              >
                <div
                  style={{
                    ...styles.knob,
                    transform: active ? "translateX(22px)" : "translateX(2px)",
                  }}
                />
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}


// ===== BLOCK 6: STYLES =====
const styles = {
  container: {
    maxWidth: "900px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
  },
  logo: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
  },
  name: {
    fontWeight: "600",
    fontSize: "16px",
  },
  toggle: {
    width: "50px",
    height: "26px",
    borderRadius: "20px",
    position: "relative",
    transition: "all 0.2s",
  },
  knob: {
    width: "22px",
    height: "22px",
    background: "#fff",
    borderRadius: "50%",
    position: "absolute",
    top: "2px",
    transition: "all 0.2s",
  },
};
