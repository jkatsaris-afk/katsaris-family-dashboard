import React, { useState, useEffect } from "react";
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
import ShoppingPage from "./ShoppingPage";

export default function App() {
  const [page, setPage] = useState("home");
  const [now, setNow] = useState(new Date());
  const [nextEvent, setNextEvent] = useState(null);

  // 🔥 LIVE CLOCK
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 🔥 FETCH NEXT EVENT
  useEffect(() => {
    const API_KEY = "AIzaSyBlYymKmOE64L-nCNQqYmY7rOilcB1fauk";

    const CALENDAR_ID =
      "family17054290429573763975@group.calendar.google.com";

    const nowISO = new Date().toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID
    )}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime&timeMin=${nowISO}&maxResults=1`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const event = data.items?.[0];

        if (!event) return;

        const start = event.start.dateTime || event.start.date;

        setNextEvent({
          title: event.summary,
          date: new Date(start),
          time: event.start.dateTime
            ? new Date(start).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })
            : "All Day",
        });
      });
  }, []);

  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const getIcon = (title) => {
    const t = title?.toLowerCase() || "";
    if (t.includes("church")) return "⛪";
    if (t.includes("football")) return "🏈";
    if (t.includes("baseball")) return "⚾";
    if (t.includes("practice")) return "⚽";
    return "📅";
  };

  const formatDay = (date) => {
    if (!date) return "";

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const apps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
    { name: "Shopping", icon: <DollarSign />, page: "shopping", color: "#8b5cf6" },
    { name: "Water", icon: <Droplet />, color: "#06b6d4" },
    { name: "Family", icon: <Users />, color: "#ec4899" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#eef1f5" }}>

      {/* 🔥 HEADER */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: "600", fontSize: "20px" }}>
          Katsaris Home
        </div>

        <div style={{ fontSize: "14px", color: "#9ca3af" }}>
          {formattedDate} | {formattedTime}
        </div>
      </div>

      {/* 🔥 NEXT EVENT CARD */}
      {page === "home" && nextEvent && (
        <div
          style={{
            margin: "0 20px 20px",
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderLeft: "5px solid #10b981",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <div style={{ fontSize: "12px", color: "#888" }}>
            Next Event
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginTop: "5px",
            }}
          >
            {getIcon(nextEvent.title)} {nextEvent.title}
          </div>

          <div style={{ fontSize: "14px", color: "#555" }}>
            {formatDay(nextEvent.date)} • {nextEvent.time}
          </div>
        </div>
      )}

      {/* 🔥 TILE BAR */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "18px",
          padding: "0 20px 20px",
        }}
      >
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
                padding: "22px",
                borderRadius: "18px",
                textAlign: "center",
                cursor: "pointer",
                opacity: isActive ? 1 : 0.85,
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive
                  ? "0 10px 20px rgba(0,0,0,0.2)"
                  : "0 6px 12px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "26px", marginBottom: "10px" }}>
                {app.icon}
              </div>

              <div style={{ fontWeight: "600", fontSize: "13px" }}>
                {app.name}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🔥 PAGE CONTENT */}
      <div style={{ padding: "20px" }}>
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "shopping" && <ShoppingPage />}
      </div>
    </div>
  );
}
