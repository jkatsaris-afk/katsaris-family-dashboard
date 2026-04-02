// ===== BLOCK 1: GLOBAL PROFILE STORE =====
let currentProfile = null;
let listeners = [];

export const setProfile = (profile) => {
  currentProfile = profile;
  listeners.forEach((cb) => cb(profile));
};

export const getProfile = () => currentProfile;

export const subscribeProfile = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
