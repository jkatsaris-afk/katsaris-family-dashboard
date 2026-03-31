return (
  <div
    style={{
      position: "relative",
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start", // 👈 moved up
      paddingTop: "80px", // 👈 controls vertical position
      overflow: "hidden",
    }}
  >

    {/* 🔥 GHOSTED LOGO */}
    <img
      src={logo}
      alt="Katsaris Brand"
      style={{
        position: "absolute",
        width: "450px",
        opacity: 0.08, // 👈 darker (was 0.05)
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    />

    {/* 🕒 TIME */}
    <div
      style={{
        fontSize: "110px",
        fontWeight: "700",
        color: "#111827",
        lineHeight: "1",
        zIndex: 1,
      }}
    >
      {formattedTime}
    </div>

    {/* 📅 DATE */}
    <div
      style={{
        fontSize: "24px",
        color: "#6b7280",
        marginBottom: "25px",
        zIndex: 1,
      }}
    >
      {formattedDate}
    </div>

    {/* 🌤️ WEATHER */}
    <div
      style={{
        fontSize: "22px",
        color: "#374151",
        zIndex: 1,
      }}
    >
      🌤 {weather.temp}° — {weather.condition}
    </div>
  </div>
);
