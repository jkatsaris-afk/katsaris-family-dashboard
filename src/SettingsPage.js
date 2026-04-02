// ===== BLOCK 1: IMPORTS =====
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  LayoutDashboard,
  ToggleLeft,
  Bell,
  Shield,
  ClipboardList,
  Info,
  Plug
} from "lucide-react";

import brand from "./assets/oikos-brand.png";

// ===== BLOCK 2: SETTINGS PAGES =====
import HomeScreenSettings from "./settings/HomeScreenSettings";
import TileAppSettings from "./settings/TileAppSettings";
import HouseholdSettings from "./settings/HouseholdSettings";
import MembersSettings from "./settings/MembersSettings";
import NotificationsSettings from "./settings/NotificationsSettings";
import SecuritySettings from "./settings/SecuritySettings";
import IntegrationsSettings from "./settings/IntegrationsSettings";
import AboutSettings from "./settings/AboutSettings";
import ModeSettings from "./settings/ModeSettings";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 3: MAIN COMPONENT =====
export default function SettingsPage() {

  // ===== BLOCK 4: STATE =====
  const [section, setSection] = useState("household");


  // ===== BLOCK 5: MENU CONFIG =====
  const menu = [
    { name: "Household", icon: <Home />, key: "household" },
    { name: "Members", icon: <Users />, key: "members" },
    { name: "Home Screen", icon: <LayoutDashboard />, key: "display" },
    { name: "Mode", icon: <ToggleLeft />, key: "mode" },
    { name: "Notifications", icon: <Bell />, key: "notifications" },
    { name: "Security", icon: <Shield />, key: "security" },
    { name: "Integrations", icon: <Plug />, key: "integrations" },
    { name: "Tile Apps", icon: <ClipboardList />, key: "tiles" },
    { name: "About", icon: <Info />, key: "about" },
  ];


  // ===== BLOCK 6: CONTENT SWITCHER =====
  const renderContent = () => {
    switch (section) {
      case "household": return <HouseholdSettings />;
      case "members": return <MembersSettings />;
      case "display": return <HomeScreenSettings />;
      case "mode": return <ModeSettings />;
      case "notifications": return <NotificationsSettings />;
      case "security": return <SecuritySettings />;
      case "integrations": return <IntegrationsSettings />;
      case "tiles": return <TileAppSettings />;
      case "about": return <AboutSettings />;
      default: return <div>Select a setting</div>;
    }
  };


  // ===== BLOCK 7: MAIN UI =====
  return (
    <div style={styles.container}>

      {/* ===== BLOCK 7A: SIDEBAR ===== */}
      <div style={styles.sidebar}>
        <div>

          <div style={styles.brandBox}>
            <img src={brand} alt="logo" style={styles.brand} />
          </div>

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
                }}
              >
                {item.icon}
                <span style={{ marginLeft: "10px" }}>
                  {item.name}
                </span>
              </motion.div>
            );
          })}
        </div>

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

      {/* ===== BLOCK 7B: RIGHT CONTENT PANEL ===== */}
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
    height: "100vh",       // 🔥 FIX: lock to screen height
    overflow: "hidden",    // 🔥 FIX: prevent full page scroll
    background: "#f8fafc",
    borderRadius: "20px",
  },

  sidebar: {
    width: "260px",
    background: "#fff",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",        // 🔥 FIX: fill container height
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
    overflowY: "auto",     // 🔥 ONLY this scrolls
    height: "100%",
    minHeight: 0,          // 🔥 prevents flex overflow bugs
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
