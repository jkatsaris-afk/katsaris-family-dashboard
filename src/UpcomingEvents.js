import React, { useEffect, useState } from "react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ICS_URL =
      "https://calendar.google.com/calendar/ical/family17054290429573763975%40group.calendar.google.com/public/basic.ics";

    fetch(`https://corsproxy.io/?${encodeURIComponent(ICS_URL)}`)
      .then((res) => res.text())
      .then((data) => {
        console.log("RAW DATA START:", data.slice(0, 500));

        const now = new Date();

        const eventsRaw = data.split("BEGIN:VEVENT").slice(1);

        const parsed = eventsRaw.map((event) => {
          const getValue = (key) => {
            const match = event.match(new RegExp(`${key}[^:]*:(.*)`));
            return match ? match[1].trim() : null;
          };

          const title = getValue("SUMMARY");
          const rawDate = getValue("DTSTART");

          if (!title || !rawDate) return null;

          let clean = rawDate.replace("Z", "");

          let date;

          try {
            if (clean.includes("T")) {
              date = new Date(
                clean.substring(0, 4),
                clean.substring(4, 6) - 1,
                clean.substring(6, 8),
                clean.substring(9, 11) || 0,
                clean.substring(11, 13) || 0
              );
            } else {
              date = new Date(
                clean.substring(0, 4),
                clean.substring(4, 6) - 1,
                clean.substring(6, 8)
              );
            }
          } catch {
            return null;
          }

          return { title, date };
        });

        const filtered = parsed
          .filter(Boolean)
          .filter((e) => e.date >= now)
          .sort((a, b) => a.date - b.date)
          .slice(0, 5);

        console.log("PARSED EVENTS:", filtered);

        setEvents(filtered);
      })
      .catch((err) => console.error("FETCH ERROR:", err));
  }, []);

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <strong>Upcoming</strong>

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
          <div style={{ fontWeight: "500" }}>{e.title}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {formatDate(e.date)}
          </div>
        </div>
      ))}
    </div>
  );
}
