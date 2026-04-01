export default function ChoreSettings() {
  return (
    <div>
      <h2>Chore Settings</h2>

      <div style={styles.card}>
        Recurring chores, store, goals, awards
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "15px",
  },
};
