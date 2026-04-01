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

// pages
import DisplaySettings from "./settings/DisplaySettings";
import HouseholdSettings from "./settings/HouseholdSettings";
import MembersSettings from "./settings/MembersSettings";
import NotificationsSettings from "./settings/NotificationsSettings";
import SecuritySettings from "./settings/SecuritySettings";
import IntegrationsSettings from "./settings/IntegrationsSettings";
import ChoreSettings from "./settings/ChoreSettings";
import AboutSettings from "./settings/AboutSettings";

const PRIMARY = "#2f6ea6";

export default function SettingsPage() {
  const [section, setSection] = useState("household");

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

  return (
    <div style={styles.container}>

      {/* LEFT MENU */}
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

      {/* RIGHT PANEL */}
      <div style={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "calc(100vh - 140px)",
    background: "#f8fafc",
    borderRadius: "20px",
    overflow: "hidden",
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
    overflowY: "auto",
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
