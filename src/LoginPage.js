import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/oikos-brand.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ If already logged in → skip to loading
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/loading");
      }
    };

    checkSession();
  }, [navigate]);

  // 🔐 LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // 🚀 Always go to loading (AuthGate handles routing)
    navigate("/loading");
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      
      {/* LOGIN CARD */}
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-xl w-[380px]">
        
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Oikos Display"
            className="w-48"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-white text-xl text-center mb-6 tracking-wide">
          Sign in to your Home
        </h2>

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-semibold mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Welcome to Oikos Display
        </p>
      </div>
    </div>
  );
}
