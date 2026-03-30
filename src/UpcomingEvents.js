import React, { useEffect, useState } from "react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const API_KEY = "AIzaSyBlYymKmOE64L-nCNQqYmY7rOilcB1fauk";

    const CALENDAR_ID =
      "family17054290429573763975@group.calendar.google.com";

    // 🔥 ONLY FUTURE EVENTS
    const now = new Date().toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID
    )}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime&timeMin=${now}&maxResults=5`;

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
      })
      .catch((err) => console.error("ERROR:", err));
  }, []);

  const today = new Date().toDateString();

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("church")) return "⛪";
    if (t.includes("game")) return "🏈";
    if (t.includes("practice")) return "⚽";
    return "📅";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* 🔥 TODAY CARD */}
      {events
        .filter(e => e.date.toDateString() === today)
        .map((e, i) => (
          <div
            key={i}
            style={{
              background: "#ecfdf5",
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: "12px", color: "#16a34a" }}>
              TODAY
            </div>

            <div style={{
              fontSize: "18px",
              fontWeight: "600",
              marginTop: "5px"
            }}>
              {getIcon(e.title)} {e.title}
            </div>

            <div style={{
              fontSize: "14px",
              color: "#555",
              marginTop: "4px"
            }}>
              {e.time}
            </div>
          </div>
        ))}

      {/* 📅 UPCOMING LIST */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: "15px", fontWeight: "600" }}>
          Upcoming
        </div>

        {events
          .filter(e => e.date.toDateString() !== today)
          .map((e, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom:
                  i !== events.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              <div>
                {getIcon(e.title)} {e.title}
              </div>

              <div style={{
                fontSize: "12px",
                color: "#666",
                textAlign: "right"
              }}>
                {e.date.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                <br />
                {e.time}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
