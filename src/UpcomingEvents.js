import React, { useEffect, useState } from "react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const API_KEY = "AIzaSyBlYymKmOE64L-nCNQqYmY7rOilcB1fauk";

    const CALENDAR_ID =
      "family17054290429573763975@group.calendar.google.com";

    // 🔥 NOW → 2 WEEKS FROM NOW
    const now = new Date().toISOString();
    const twoWeeks = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 14
    ).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID
    )}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime&timeMin=${now}&timeMax=${twoWeeks}&maxResults=10`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const items = data.items || [];

        const parsed = items.map((e) => {
          const start = e.start.dateTime || e.start.date;

          return {
            title: e.summary,
            date: new Date(start),
            time: e.start.dateTime
              ? new Date(start).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "All Day",
          };
        });

        setEvents(parsed);
      });
  }, []);

  const todayStr = new Date().toDateString();

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("church")) return "⛪";
    if (t.includes("football")) return "🏈";
    if (t.includes("baseball")) return "⚾";
    if (t.includes("practice")) return "⚽";
    return "📅";
  };

  const formatDay = (date) => {
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

  const todayEvents = events.filter(
    (e) => e.date.toDateString() === todayStr
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* 🔥 TODAY SECTION */}
      <div>
        <div style={{ fontWeight: "600", marginBottom: "10px" }}>
          Today
        </div>

        {todayEvents.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "15px",
              color: "#888",
            }}
          >
            No events today
          </div>
        ) : (
          todayEvents.map((e, i) => (
            <div
              key={i}
              style={{
                background: "#ecfdf5",
                borderRadius: "20px",
                padding: "20px",
                marginBottom: "10px",
                boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "600" }}>
                {getIcon(e.title)} {e.title}
              </div>

              <div style={{ fontSize: "14px", color: "#555" }}>
                {e.time}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 📅 UPCOMING TILE GRID */}
      <div>
        <div style={{ fontWeight: "600", marginBottom: "10px" }}>
          Upcoming (Next 2 Weeks)
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {events.map((e, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                padding: "15px",
                borderRadius: "18px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "5px" }}>
                {getIcon(e.title)}
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {e.title}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "5px",
                }}
              >
                {formatDay(e.date)}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#999",
                }}
              >
                {e.time}
              </div>
            </div>
          ))}

          {/* ➕ ADD EVENT TILE */}
          <div
            onClick={() =>
              window.open(
                "https://calendar.google.com/calendar/u/0/r/eventedit",
                "_blank"
              )
            }
            style={{
              background: "#10b981",
              color: "white",
              padding: "15px",
              borderRadius: "18px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              fontWeight: "600",
            }}
          >
            <div style={{ fontSize: "22px" }}>➕</div>
            <div>Add Event</div>
          </div>
        </div>
      </div>
    </div>
  );
}
