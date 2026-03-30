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
import UpcomingEvents from "./UpcomingEvents";

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

      {/* 🔥 TILE APP BAR */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: "15px",
        padding: "0 20px 20px"
      }}>
        {apps.map((app, i) => {
          const isActive = page === app.page;

          return (
            <motion.div
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => app.page && setPage(app.page)}
              style={{
                background: app.color,
                color: "white",
                padding: "20px",
                borderRadius: "18px",
                textAlign: "center",
                cursor: "pointer",

                opacity: isActive ? 1 : 0.85,
                transform: isActive ? "scale(1.05)" : "scale(1)",

                boxShadow: isActive
                  ? "0 10px 20px rgba(0,0,0,0.2)"
                  : "0 6px 12px rgba(0,0,0,0.1)",

                transition: "all 0.2s ease"
              }}
            >
              <div style={{
                fontSize: "26px",
                marginBottom: "10px"
              }}>
                {app.icon}
              </div>

              <div style={{
                fontWeight: "600",
                fontSize: "13px"
              }}>
                {app.name}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🔥 PAGE CONTENT */}
      <div style={{ padding: "20px" }}>

        {/* 🏠 HOME */}
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

        {/* 📅 CALENDAR */}
        {page === "calendar" && (
          <UpcomingEvents />
        )}

        {/* 🧹 CHORES */}
        {page === "chores" && <ChoresPage />}

      </div>

    </div>
  );
}
