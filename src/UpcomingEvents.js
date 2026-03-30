import React, { useEffect, useState } from "react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("https://clients6.google.com/calendar/v3/calendars/family17054290429573763975%40group.calendar.google.com/events?singleEvents=true&orderBy=startTime&maxResults=5")
      .then(res => res.json())
      .then(data => {
        const items = data.items || [];

        const parsed = items.map(e => ({
          title: e.summary,
          date: new Date(e.start.dateTime || e.start.date)
        }));

        setEvents(parsed);
      })
      .catch(err => console.error(err));
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
      boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
      }}>
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
            fontSize: "12px"
          }}
        >
          + Add
        </button>
      </div>

      {events.length === 0 && (
        <div style={{ color: "#999" }}>No upcoming events</div>
      )}

      {events.map((e, i) => (
        <div key={i} style={{
          padding: "10px 0",
          borderBottom: i !== events.length - 1 ? "1px solid #eee" : "none"
        }}>
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
