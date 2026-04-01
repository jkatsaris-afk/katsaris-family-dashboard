import React, { useState } from "react";
import { supabase } from "./lib/supabase";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return alert(error.message);

      alert("Account created! You can now log in.");
      setIsSignup(false);
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return alert(error.message);

      onLogin(data.user);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Oikos Display</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleAuth} style={styles.button}>
          {isSignup ? "Create Account" : "Login"}
        </button>

        <div
          onClick={() => setIsSignup(!isSignup)}
          style={styles.toggle}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Create an account"}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef1f5",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    background: "#2f6ea6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
  toggle: {
    marginTop: "15px",
    cursor: "pointer",
    color: "#2f6ea6",
    fontSize: "14px",
  },
};
