import React, { useEffect, useState } from "react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ICS_URL =
      "https://calendar.google.com/calendar/ical/family17054290429573763975%40group.calendar.google.com/public/basic.ics";

    fetch(`https://corsproxy.io/?${encodeURIComponent(ICS_URL)}`)
      .then((res) => res.text())
      .then((data) => {
        console.log("RAW DATA:", data);

        const now = new Date();

        const parsed = data
          .split("BEGIN:VEVENT")
          .slice(1)
          .map((event) => {
            const title = event.match(/SUMMARY:(.*)/)?.[1];

            // Handles ALL Google date formats
            const rawDate = event.match(/DTSTART[^:]*:(.*)/)?.[1];

            if (!rawDate || !title) return null;

            let cleanDate = rawDate.replace("Z", "");

            let date;

            if (cleanDate.includes("T")) {
              // Timed event
              date = new Date(
                cleanDate.substring(0, 4),
                cleanDate.substring(4, 6) - 1,
                cleanDate.substring(6, 8),
                cleanDate.substring(9, 11) || 0,
                cleanDate.substring(11, 13) || 0
              );
            } else {
              // All-day event
              date = new Date(
                cleanDate.substring(0, 4),
                cleanDate.substring(4, 6) - 1,
                cleanDate.substring(6, 8)
              );
            }

            return { title, date };
          })
          .filter(Boolean)

          // 🔥 THIS FIXES YOUR ISSUE
          .filter((e) => e.date >= now)

          .sort((a, b) => a.date - b.date)
          .slice(0, 5);

        console.log("PARSED EVENTS:", parsed);

        setEvents(parsed);
      })
      .catch((err) => console.error("FETCH ERROR:", err));
  }, []);

  // 📅 Format Date
  const formatDate = (date) => {
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";

    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <strong>Upcoming</strong>

        {/* ➕ ADD EVENT */}
        <button
          onClick={() =>
            window.open(
              "https://calendar.google.com/calendar/u/0/r/eventedit",
              "_blank"
            )
          }
          style={{
            padding: "6px 12px",
            borderRadius: "10px",
            border: "none",
            background: "#10b981",
            color: "#fff",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          + Add
        </button>
      </div>

      {/* EVENTS */}
      {events.length === 0 && (
        <div style={{ color: "#999" }}>No upcoming events</div>
      )}

      {events.map((e, i) => (
        <div
          key={i}
          style={{
            padding: "10px 0",
            borderBottom:
              i !== events.length - 1 ? "1px solid #eee" : "none",
          }}
        >
          <div
            style={{
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            {e.title}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "2px",
            }}
          >
            {formatDate(e.date)}
          </div>
        </div>
      ))}
    </div>
  );
}
