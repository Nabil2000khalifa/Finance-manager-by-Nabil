export const STORAGE_KEYS = {
  token: "finance_manager_token",
  user: "finance_manager_user",
};

export const getStoredUser = () => {
  const value = localStorage.getItem(STORAGE_KEYS.user);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const storeSession = ({ token, user }) => {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

export const updateStoredUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
};
