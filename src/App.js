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
    { name: "Calendar", icon: <Calendar />, link: "https://calendar.google.com", color: "#10b981" },
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

      {/* 🔥 APP BAR (PERSISTENT) */}
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
                if (app.link) {
                  window.open(app.link, "_blank");
                } else if (app.page) {
                  setPage(app.page);
                }
              }}
              style={{
                minWidth: "100px",
                padding: "14px",
                borderRadius: "16px",
                textAlign: "center",
                cursor: "pointer",

                // 🔥 ACTIVE STYLE
                background: isActive ? "#111" : "#fff",
                color: isActive ? "#fff" : "#000",

                boxShadow: isActive
                  ? "0 6px 14px rgba(0,0,0,0.15)"
                  : "0 4px 10px rgba(0,0,0,0.05)",

                transition: "all 0.2s ease"
              }}
            >
              <div style={{
                fontSize: "20px",
                marginBottom: "6px"
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

        {page === "chores" && <ChoresPage />}
      </div>

    </div>
  );
}
