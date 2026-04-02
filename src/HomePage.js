// ===== BLOCK 8: MAIN UI =====
return (
  <div style={styles.container}>

    {/* ✅ HOUSEHOLD NAME (SAFE INSERT) */}
    {settings?.home_show_household_name && (
      <div style={styles.householdName}>
        {householdName}
      </div>
    )}

    {/* ===== BLOCK 8A: GLASS TILE ===== */}
    <div style={styles.glassTile}>

      {/* CLOCK */}
      {displaySettings?.visible_widgets?.clock !== false && (
        <div style={styles.time}>
          {formattedTime}
        </div>
      )}

      {/* DATE */}
      {displaySettings?.visible_widgets?.date !== false && (
        <div style={styles.date}>
          {formattedDate}
        </div>
      )}

      {/* WEATHER */}
      {displaySettings?.visible_widgets?.weather !== false && (
        <div style={styles.weather}>
          <div style={styles.weatherMain}>
            {weather.temp}° • {weather.condition}
          </div>

          <div style={styles.weatherSub}>
            Feels like {weather.feels}° • H {weather.high}° / L {weather.low}°
          </div>

          <div style={styles.weatherTomorrow}>
            Tomorrow: {weather.tomorrowHigh}° / {weather.tomorrowLow}° • {weather.tomorrowCondition}
          </div>
        </div>
      )}

      {/* EVENTS */}
      {displaySettings?.visible_widgets?.events && (
        <div style={{ marginTop: "15px", color: "#6b7280" }}>
          📅 No events today
        </div>
      )}

      {/* COUNTDOWN */}
      {displaySettings?.visible_widgets?.countdown && (
        <div style={{ marginTop: "10px", color: "#6b7280" }}>
          ⏳ Countdown not set
        </div>
      )}

      {/* BIBLE */}
      {displaySettings?.visible_widgets?.bible && verse && (
        <div style={{ marginTop: "15px", color: "#374151" }}>
          <div style={{ fontStyle: "italic" }}>
            "{verse.text}"
          </div>
          <div style={{ marginTop: "5px", fontWeight: "600" }}>
            {verse.reference}
          </div>
        </div>
      )}

    </div>

    {/* ===== BLOCK 8B: LOGO ===== */}
    {logo && (
      <img
        src={logo}
        alt="Oikos Brand"
        style={styles.logo}
      />
    )}

  </div>
);
