import React, { useEffect, useState } from "react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ICS_URL = "https://calendar.google.com/calendar/ical/family17054290429573763975%40group.calendar.google.com/private-7783461977905064bf6ec3ea53a69f3b/basic.ics";

    fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(ICS_URL)}`)
      .then(res => res.text())
      .then(data => {
        const parsed = data
          .split("BEGIN:VEVENT")
          .slice(1)
          .map(event => {
            const title = event.match(/SUMMARY:(.*)/)?.[1];
            const rawDate = event.match(/DTSTART:(.*)/)?.[1];

            if (!rawDate) return null;

            const date = new Date(
              rawDate.substring(0, 4),
              rawDate.substring(4, 6) - 1,
              rawDate.substring(6, 8),
              rawDate.substring(9, 11) || 0,
              rawDate.substring(11, 13) || 0
            );

            return { title, date };
          })
          .filter(Boolean)
          .sort((a, b) => a.date - b.date)
          .slice(0, 5);

        setEvents(parsed);
      });
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
      day: "numeric"
    });
  };

  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
      marginBottom: "20px"
    }}>
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
      }}>
        <strong>Upcoming</strong>

        <button
          onClick={() => window.open("https://calendar.google.com", "_blank")}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "none",
            background: "#10b981",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Open
        </button>
      </div>

      {/* EVENTS */}
      {events.length === 0 && (
        <div style={{ color: "#999" }}>No upcoming events</div>
      )}

      {events.map((e, i) => (
        <div key={i} style={{ marginBottom: "12px" }}>
          <div style={{ fontWeight: "500" }}>
            {e.title}
          </div>

          <div style={{
            fontSize: "12px",
            color: "#666"
          }}>
            {formatDate(e.date)}
          </div>
        </div>
      ))}
    </div>
  );
}
