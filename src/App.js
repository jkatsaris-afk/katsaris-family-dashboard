import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  ClipboardList,
  DollarSign,
  Droplet,
  Users,
} from "lucide-react";

import ChoresPage from "./ChoresPage";

export default function App() {
  const [page, setPage] = useState("home");

  const apps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
    { name: "Budget", icon: <DollarSign />, color: "#8b5cf6" },
    { name: "Water", icon: <Droplet />, color: "#06b6d4" },
    { name: "Family", icon: <Users />, color: "#ec4899" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#eef1f5" }}>

      {/* HEADER */}
      <div style={{
        padding: "20px",
        fontWeight: "600",
        fontSize: "20px"
      }}>
        Katsaris Home
      </div>

      {/* 🔥 APP BAR */}
      <div style={{
        display: "flex",
        gap: "12px",
        overflowX: "auto",
        padding: "0 20px 20px"
      }}>
        {apps.map((app, i) => {
          const isActive = page === app.page;

          return (
            <motion.div
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (app.page) setPage(app.page);
              }}
              style={{
                minWidth: "100px",
                padding: "14px",
                borderRadius: "16px",
                textAlign: "center",
                cursor: "pointer",

                // 🎨 STYLE
                background: isActive
                  ? "#111"
                  : `${app.color}20`,

                color: isActive ? "#fff" : "#111",

                border: isActive
                  ? "none"
                  : `1px solid ${app.color}40`,

                boxShadow: isActive
                  ? "0 6px 14px rgba(0,0,0,0.2)"
                  : "0 4px 10px rgba(0,0,0,0.05)",

                transition: "all 0.2s ease"
              }}
            >
              <div style={{
                fontSize: "20px",
                marginBottom: "6px",
                color: isActive ? "#fff" : app.color
              }}>
                {app.icon}
              </div>

              <div style={{
                fontSize: "12px",
                fontWeight: "500"
              }}>
                {app.name}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🔥 PAGE CONTENT */}
      <div style={{ padding: "20px" }}>

        {/* HOME */}
        {page === "home" && (
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "20px",
            boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
          }}>
            <h3>Welcome Home</h3>
            <p>Select an app above to get started.</p>
          </div>
        )}

        {/* 📅 CALENDAR (EMBEDDED) */}
        {page === "calendar" && (
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
          }}>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=primary&ctz=America/Los_Angeles"
              style={{
                border: 0,
                width: "100%",
                height: "700px"
              }}
              frameBorder="0"
              scrolling="no"
              title="Google Calendar"
            />
          </div>
        )}

        {/* 🧹 CHORES */}
        {page === "chores" && <ChoresPage />}

      </div>

    </div>
  );
}
