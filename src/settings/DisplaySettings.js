import React from "react";

export default function DisplaySettings() {
  return (
    <div>
      <h2>Display Settings</h2>

      <div style={styles.cardBlock}>
        <h3>Home Screen Image</h3>
        <div style={styles.row}>
          <span>Upload background</span>
          <button style={styles.btn}>Choose File</button>
        </div>
      </div>

      <div style={styles.cardBlock}>
        <h3>Auto Night Mode</h3>
        <div style={styles.row}>
          <span>Enable automatic night mode</span>
          <div style={styles.toggle} />
        </div>
      </div>

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
          <div key={tile} style={styles.row}>
            <span>{tile}</span>
            <div style={styles.toggle} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  cardBlock: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "15px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  btn: {
    background: "#2f6ea6",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
  },
  toggle: {
    width: "40px",
    height: "20px",
    background: "#e5e7eb",
    borderRadius: "999px",
  },
};
