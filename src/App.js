function AppContent() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [page, setPage] = useState("home");

  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);
  const [settings, setSettings] = useState(null);
  const [displaySettings, setDisplaySettings] = useState(null);
  const [now, setNow] = useState(new Date());

  // AUTH
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoadingUser(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoadingUser(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // CLOCK
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // SETTINGS LOAD
  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      const { data: member } = await supabase
        .from("household_members")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!member) return;

      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("household_id", member.household_id)
        .maybeSingle();

      if (data) {
        setSettings(data);
        setAutoNightEnabled(data.auto_night_mode);
        setDisplaySettings(data);
      }
    };

    loadSettings();
  }, [user]);

  // REALTIME SETTINGS
  useEffect(() => {
    if (!user || !settings) return;

    const channel = supabase
      .channel("settings-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
        },
        (payload) => {
          if (payload.new?.id === settings.id) {
            setDisplaySettings(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, settings]);

  // 🌙 AUTO NIGHT MODE
  useEffect(() => {
    if (!autoNightEnabled) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      setNightMode(hour >= 20 || hour < 6);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [autoNightEnabled]);

  const allApps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
    { name: "Weather", icon: <CloudSun />, page: "weather", color: "#0ea5e9" },
    { name: "Lists", icon: <List />, page: "lists", color: "#8b5cf6" },
    { name: "Family", icon: <Users />, page: "family", color: "#6366f1" },
    { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls", color: "#22c55e" },
  ];

  const apps = displaySettings?.visible_tiles
    ? allApps.filter((app) => displaySettings.visible_tiles[app.page])
    : allApps;

  if (loadingUser) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <LoginPage />;

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",

        // 🔥 BACKGROUND CONTROL
        background: nightMode
          ? "#000"
          : displaySettings?.background_url
          ? `url(${displaySettings.background_url}) center/cover no-repeat`
          : "#eef1f5",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <img src={brand} alt="Oikos Display" style={{ height: "38px" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div
            onClick={() => setNightMode(!nightMode)}
            style={{
              cursor: "pointer",
              padding: "8px",
              borderRadius: "10px",
              background: nightMode ? "#111" : "#fff",
            }}
          >
            <Moon size={18} />
          </div>

          <div
            onClick={() =>
              setPage((prev) => (prev === "settings" ? "home" : "settings"))
            }
            style={{
              cursor: "pointer",
              padding: "8px",
              borderRadius: "10px",
              background: page === "settings" ? PRIMARY : "#fff",
              color: page === "settings" ? "#fff" : "#000",
            }}
          >
            <Settings size={20} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",

          padding: nightMode ? "0px" : "10px 20px 120px",

          display: nightMode ? "flex" : "block",
          alignItems: nightMode ? "center" : "unset",
          justifyContent: nightMode ? "center" : "unset",

          zIndex: 5,
        }}
      >
        {page === "home" && <HomePage />}
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "weather" && <WeatherPage />}
        {page === "lists" && <ShoppingPage />}
        {page === "settings" && <SettingsPage />}
        {page === "family" && <FamilyPage />}
        {page === "homeControls" && <HomeControlsPage />}
      </div>

      {/* DOCK */}
      {!nightMode && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "95%",
              maxWidth: "1400px",
              background: "#eef1f5",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "20px",
              boxShadow: "0 -5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${apps.length}, 1fr)`,
                gap: "12px",
              }}
            >
              {apps.map((app, i) => {
                const isActive = page === app.page;

                return (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(app.page)}
                    style={{
                      background: app.color,
                      color: "white",
                      padding: "14px",
                      borderRadius: "14px",
                      textAlign: "center",
                      cursor: "pointer",
                      opacity: isActive ? 1 : 0.85,
                    }}
                  >
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>
                      {app.icon}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "600" }}>
                      {app.name}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
