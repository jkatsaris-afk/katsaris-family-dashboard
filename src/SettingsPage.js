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
    { name: "Display", icon: <Moon />, key: "display" },
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

          {/* ===== BLOCK 7A-1: LOGO ===== */}
          <div style={styles.brandBox}>
            <img src={brand} alt="logo" style={styles.brand} />
          </div>

          {/* ===== BLOCK 7A-2: MENU ITEMS ===== */}
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

        {/* ===== BLOCK 7A-3: LOGOUT ===== */}
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
    height: "100%",              // ✅ FIXED (was calc)
    maxHeight: "100%",          // ✅ prevents overflow
    background: "#f8fafc",
    borderRadius: "20px",
    overflow: "hidden",         // ✅ keeps it clean
  },
};
