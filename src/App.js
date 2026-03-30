import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  ClipboardList,
  DollarSign,
  Droplet,
  Users,
} from "lucide-react";

const apps = [
  { name: "House Build", icon: <Home />, color: "#3b82f6" },
  { 
    name: "Calendar", 
    icon: <Calendar />, 
    color: "#10b981",
    link: "https://calendar.google.com"
  },
  { name: "Football", icon: <ClipboardList />, color: "#f97316" },
  { name: "Budget", icon: <DollarSign />, color: "#8b5cf6" },
  { name: "Water System", icon: <Droplet />, color: "#06b6d4" },
  { name: "Family", icon: <Users />, color: "#ec4899" },
];

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "20px" }}>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h1>Katsaris Home</h1>
        <div>{new Date().toLocaleDateString()}</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "20px",
        }}
      >
        {apps.map((app, index) => (
         <motion.div
  key={index}
  whileTap={{ scale: 0.95 }}
  onClick={() => app.link && window.open(app.link, "_blank")}
  style={{
    background: app.color,
    color: "white",
    padding: "25px",
    borderRadius: "16px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
  }}
>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>
              {app.icon}
            </div>
            <div>{app.name}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
