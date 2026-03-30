import React from "react";

export default function MediaPage() {
  const apps = [
    {
      name: "YouTube",
      color: "#ef4444",
      url: "https://www.youtube.com"
    },
    {
      name: "Netflix",
      color: "#111827",
      url: "https://www.netflix.com"
    },
    {
      name: "Discovery+",
      color: "#2563eb",
      url: "https://www.discoveryplus.com"
    },
    {
      name: "Hulu",
      color: "#16a34a",
      url: "https://www.hulu.com"
    },
    {
      name: "Apple TV",
      color: "#1f2937",
      url: "https://tv.apple.com"
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      
      {/* HEADER */}
      <div style={{ fontWeight: "700", marginBottom: "15px" }}>
        Media
      </div>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "20px"
      }}>
        {apps.map((app, i) => (
          <div
            key={i}
            onClick={() => window.open(app.url, "_blank")}
            style={{
              background: app.color,
              color: "#fff",
              padding: "25px",
              borderRadius: "18px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {app.name}
          </div>
        ))}
      </div>

    </div>
  );
}
