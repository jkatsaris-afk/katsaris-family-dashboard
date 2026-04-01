if (section === "display") {
  return (
    <div>
      <h2>Display Settings</h2>

      {/* 🖼️ HOME SCREEN IMAGE */}
      <div style={styles.cardBlock}>
        <h3>Home Screen Image</h3>

        <div style={styles.placeholderRow}>
          <div>Upload background image</div>
          <button style={styles.placeholderBtn}>Choose File</button>
        </div>

        <div style={styles.subText}>
          Set a custom background for your home screen
        </div>
      </div>

      {/* 🌙 AUTO NIGHT MODE */}
      <div style={styles.cardBlock}>
        <h3>Auto Night Mode</h3>

        <div style={styles.placeholderRow}>
          <div>Automatically enable night mode</div>
          <div style={styles.toggleFake} />
        </div>

        <div style={styles.subText}>
          Dim the screen and show clock at night
        </div>
      </div>

      {/* 🧱 SHOW TILES */}
      <div style={styles.cardBlock}>
        <h3>Show Tiles</h3>

        {[
          "Home",
          "Calendar",
          "Chores",
          "Weather",
          "Lists",
          "Family",
          "Home Controls",
        ].map((tile) => (
          <div key={tile} style={styles.placeholderRow}>
            <div>{tile}</div>
            <div style={styles.toggleFake} />
          </div>
        ))}

        <div style={styles.subText}>
          Control which tiles appear on the bottom dock
        </div>
      </div>
    </div>
  );
}
