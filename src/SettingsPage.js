// ===== BLOCK 1: IMPORTS =====
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Moon,
  Bell,
  Shield,
  ClipboardList,
  Info,
  Plug
} from "lucide-react";

import brand from "./assets/oikos-brand.png";

// ===== BLOCK 2: SETTINGS PAGES =====
import DisplaySettings from "./settings/DisplaySettings";
import HouseholdSettings from "./settings/HouseholdSettings";
import MembersSettings from "./settings/MembersSettings";
import NotificationsSettings from "./settings/NotificationsSettings";
import SecuritySettings from "./settings/SecuritySettings";
import IntegrationsSettings from "./settings/IntegrationsSettings";
import ChoreSettings from "./settings/ChoreSettings";
import AboutSettings from "./settings/AboutSettings";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 3: MAIN COMPONENT =====
export default function SettingsPage() {

  // ===== BLOCK 4: STATE =====
  const [section, setSection] = useState("household");


  // ===== BLOCK 5: MENU CONFIG =====
  const menu = [
    { name: "Household", icon: <Home />, key: "household" },
    { name: "Members", icon: <Users />, key: "members" },

    // DISPLAY + MODES
    { name: "Display", icon: <Moon />, key: "display" },
    { name: "Modes", icon: <Moon />, key: "modes", indent: true },

    { name: "Notifications", icon: <Bell />, key: "notifications" },
    { name: "Security", icon: <Shield />, key: "security" },
    { name: "Integrations", icon: <Plug />, key: "integrations" },
    { name: "Chores", icon: <ClipboardList />, key: "chores" },
    { name: "About", icon: <Info />, key: "about" },
  ];


  // ===== BLOCK 6: CONTENT SWITCHER =====
  const renderContent = () => {
    switch (section) {

      case "household":
        return <HouseholdSettings />;

      case "members":
        return <MembersSettings />;

      case "display":
        return <DisplaySettings />;

      case "modes":
        return <div>Modes Settings Coming Soon</div>;

      case "notifications":
        return <NotificationsSettings />;

      case "security":
        return <SecuritySettings />;

      case "integrations":
        return <IntegrationsSettings />;

      case "chores":
        return <ChoreSettings />;

      case "about":
        return <AboutSettings />;

      default:
        return <div>Select a setting</div>;
    }
  };


  // ===== BLOCK 7: MAIN UI =====
  return (
    <div style={styles.container}>

      {/* ===== BLOCK 7A: SIDEBAR ===== */}
      <div style={styles.sidebar}>
        <div>

          {/* LOGO */}
          <div style={styles.brandBox}>
            <img src={brand} alt="logo" style={styles.brand} />
          </div>

          {/* MENU */}
          {menu.map((item, i) => {
            const active = section === item.key;

            return (
              <motion.div
                key={i}
                onClick={() => setSection(item.key)}
                style={{
                  ...styles.menuItem,
                  background: active ? PRIMARY : "transparent",
                  color: active ? "#fff" : "#333",
                  marginLeft: item.indent ? "20px" : "0px", // 👈 indent for Modes
                  fontSize: item.indent ? "14px" : "16px",
                }}
              >
                {item.icon}
                <span style={{ marginLeft: "10px" }}>{item.name}</span>
              </motion.div>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div
          onClick={async () => {
            const { supabase } = await import("./lib/supabase");
            await supabase.auth.signOut();
            window.location.reload();
          }}
          style={styles.logout}
        >
          Logout
        </div>
      </div>


      {/* ===== BLOCK 7B: CONTENT PANEL ===== */}
      <div style={styles.content}>
        {renderContent()}
      </div>

    </div>
  );
}


// ===== BLOCK 8: STYLES =====
const styles = {
  container: {
    display: "flex",
    height: "100%",            // ✅ FIXED (no more calc)
    maxHeight: "100%",
    background: "#f8fafc",
    borderRadius: "20px",
    overflow: "hidden",        // ✅ prevents page scroll
  },
  sidebar: {
    width: "260px",
    background: "#fff",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  brandBox: {
    padding: "10px",
  },
  brand: {
    width: "100%",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "25px",
    overflowY: "auto",   // ✅ only this scrolls
    height: "100%",
  },
  logout: {
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#ef4444",
    fontWeight: "600",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
  },
};
