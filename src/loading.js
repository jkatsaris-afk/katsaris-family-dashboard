useEffect(() => {
  const checkUser = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data: member } = await supabase
      .from("household_members")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!member) {
      navigate("/onboarding");
    } else {
      navigate("/home");import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import logo from "../assets/oikos-brand.png";

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: member } = await supabase
        .from("household_members")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!member) {
        navigate("/onboarding");
      } else {
        navigate("/home");
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      
      {/* LOGO */}
      <motion.img
        src={logo}
        alt="Oikos Display"
        className="w-72 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* LOADING TEXT */}
      <motion.div
        className="text-lg tracking-wide text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Checking for your Oikos...
      </motion.div>

      {/* DOT ANIMATION */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-white rounded-full"
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
}
    }
  };

  checkUser();
}, []);
