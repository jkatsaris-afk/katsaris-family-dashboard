export default function HomeScreenSettings() {

  const [settings, setSettings] = useState(null);
  const [profile, setProfile] = useState(null);

  // your useEffect + functions stay here

  if (!settings) return <div>Loading settings...</div>;

  return (
    <div>
      <h2>Home Screen Settings</h2>

      {/* APPEARANCE */}
      <div style={styles.cardBlock}>
        <div style={styles.cardHeader}>
          <Image size={20} />
          <span>Appearance</span>
        </div>

        <div style={styles.uploadRow}>
          <div>
            <div style={styles.label}>Background Image</div>
            <div style={styles.sub}>
              Full screen background for your dashboard
            </div>
          </div>

          <label style={styles.uploadBtn}>
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "background")}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {settings.background_url && (
          <>
            <img src={settings.background_url} style={styles.previewLarge} />

            <button
              onClick={() => handleRemove("background")}
              style={styles.removeBtn}
            >
              Remove Background
            </button>

            <div style={{ ...styles.row, ...styles.rowDivider }}>
              <div>
                <div style={styles.label}>Show Household Name</div>
                <div style={styles.sub}>
                  Displays your household name above the main home widget
                </div>
              </div>

              <div
                onClick={() =>
                  updateSettings({
                    home_show_household_name:
                      !settings.home_show_household_name,
                  })
                }
                style={{
                  ...styles.toggle,
                  background: settings.home_show_household_name
                    ? PRIMARY
                    : "#e5e7eb",
                }}
              >
                <div
                  style={{
                    ...styles.knob,
                    left: settings.home_show_household_name
                      ? "22px"
                      : "2px",
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* BEHAVIOR */}
      <div style={styles.cardBlock}>
        <div style={styles.cardHeader}>
          <Settings2 size={20} />
          <span>Behavior</span>
        </div>

        <div style={{ ...styles.row, ...styles.rowDivider }}>
          <div>
            <div style={styles.label}>Automatic Night Mode</div>
            <div style={styles.sub}>
              Switches to night mode at 8:00 PM and stays active until 6:00 AM
            </div>
          </div>

          <div
            onClick={() =>
              updateSettings({
                auto_night_mode: !settings.auto_night_mode,
              })
            }
            style={{
              ...styles.toggle,
              background: settings.auto_night_mode ? PRIMARY : "#e5e7eb",
            }}
          >
            <div
              style={{
                ...styles.knob,
                left: settings.auto_night_mode ? "22px" : "2px",
              }}
            />
          </div>
        </div>

        <div style={{ ...styles.row, ...styles.rowDivider }}>
          <span>Return to Home after inactivity</span>

          <div
            onClick={() =>
              updateSettings({
                inactivity_enabled: !settings.inactivity_enabled,
              })
            }
            style={{
              ...styles.toggle,
              background: settings.inactivity_enabled ? PRIMARY : "#e5e7eb",
            }}
          >
            <div
              style={{
                ...styles.knob,
                left: settings.inactivity_enabled ? "22px" : "2px",
              }}
            />
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          Returns to Home after 10 minutes of inactivity
        </div>
      </div>

      {/* WIDGETS */}
      <div style={styles.cardBlock}>
        <div style={styles.cardHeader}>
          <LayoutGrid size={20} />
          <span>Widgets</span>
        </div>

        {[
          ["clock", "Clock"],
          ["date", "Date"],
          ["weather", "Weather"],
          ["events", "Today's Events"],
          ["countdown", "Countdown"],
          ["bible", "Daily Bible Verse"],
        ].map(([key, label]) => (
          <div key={key} style={{ ...styles.row, ...styles.rowDivider }}>
            <span>{label}</span>

            <div
              onClick={() => toggleWidget(key)}
              style={{
                ...styles.toggle,
                background: settings.visible_widgets?.[key]
                  ? PRIMARY
                  : "#e5e7eb",
              }}
            >
              <div
                style={{
                  ...styles.knob,
                  left: settings.visible_widgets?.[key]
                    ? "22px"
                    : "2px",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* LAYOUT */}
      <div style={styles.cardBlock}>
        <div style={styles.cardHeader}>
          <LayoutGrid size={20} />
          <span>Layout</span>
        </div>

        {Object.entries(defaultTiles).map(([key]) => (
          <div key={key} style={{ ...styles.row, ...styles.rowDivider }}>
            <span>{key}</span>

            <div
              onClick={() => toggleTile(key)}
              style={{
                ...styles.toggle,
                background: settings.visible_tiles[key]
                  ? PRIMARY
                  : "#e5e7eb",
              }}
            >
              <div
                style={{
                  ...styles.knob,
                  left: settings.visible_tiles[key]
                    ? "22px"
                    : "2px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
