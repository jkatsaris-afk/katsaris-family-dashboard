import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./services/supabaseClient";
import logo from "./assets/oikos-brand.png";

export default function OnboardingPage() {
  const navigate = useNavigate();

  const [householdName, setHouseholdName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data: household, error } = await supabase
      .from("households")
      .insert({
        name: householdName,
        created_by: user.id,
      })
      .select()
      .maybeSingle();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("household_members").insert({
      user_id: user.id,
      household_id: household.id,
      role: "admin",
    });

    navigate("/home");
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-neutral-900 p-8 rounded-2xl w-[420px]">
        
        <div className="flex justify-center mb-6">
          <img src={logo} className="w-52" alt="logo" />
        </div>

        <h2 className="text-center text-xl mb-4">
          Create Your Household
        </h2>

        <form onSubmit={handleCreateHousehold} className="flex flex-col gap-4">
          <input
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            placeholder="Household Name"
            className="p-3 bg-black border border-gray-700 rounded-lg"
          />

          <button className="bg-blue-600 p-3 rounded-lg">
            {loading ? "Creating..." : "Create Household"}
          </button>
        </form>
      </div>
    </div>
  );
}
