// ===== BLOCK 1: PROFILE STORE =====
let currentProfile = null;
let listeners = [];

// SET PROFILE
export const setProfile = (profile) => {
  currentProfile = profile;
  localStorage.setItem("oikos_profile", JSON.stringify(profile));
  listeners.forEach((cb) => cb(profile));
};

// GET PROFILE
export const getProfile = () => {
  if (currentProfile) return currentProfile;

  const stored = localStorage.getItem("oikos_profile");
  if (stored) {
    currentProfile = JSON.parse(stored);
    return currentProfile;
  }

  return null;
};

// SUBSCRIBE (for live updates)
export const subscribeProfile = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
