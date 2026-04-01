export default function AboutSettings() {
  return (
    <div>
      <h2>About</h2>

      <div style={styles.card}>
        Device and app information
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
