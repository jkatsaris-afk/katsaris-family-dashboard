export default function SettingsPage({ visibleTiles, setVisibleTiles }) {

  const toggleTile = (tile) => {
    setVisibleTiles((prev) =>
      prev.includes(tile)
        ? prev.filter((t) => t !== tile)
        : [...prev, tile]
    );
  };

  const renderContent = () => {

    if (section === "display") {
      return (
        <div>
          <h2>Display Settings</h2>

          {/* IMAGE */}
          <div style={styles.cardBlock}>
            <h3>Home Screen Image</h3>
            <input type="file" />
          </div>

          {/* AUTO NIGHT */}
          <div style={styles.cardBlock}>
            <h3>Auto Night Mode</h3>
            <input type="checkbox" />
          </div>

          {/* TILE CONTROL */}
          <div style={styles.cardBlock}>
            <h3>Show Tiles</h3>

            {[
              "home",
              "calendar",
              "chores",
              "weather",
              "lists",
              "family",
              "homeControls",
            ].map((tile) => (
              <div key={tile} style={styles.row}>
                <input
                  type="checkbox"
                  checked={visibleTiles.includes(tile)}
                  onChange={() => toggleTile(tile)}
                />
                <span>{tile}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <div>Select a setting</div>;
  };
}
