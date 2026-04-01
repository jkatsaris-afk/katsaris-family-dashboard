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
}, []);
