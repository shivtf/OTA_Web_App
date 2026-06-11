import axiosInstance from "./axiosInstance";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user";

// ── Storage helpers ───────────────────────────────────────────────────────────
export const storeSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getToken());

// ── Auth API calls ────────────────────────────────────────────────────────────

/**
 * Login with email + password.
 * POST /auth/login → { token, user }
 */
export const login = async ({ email, password }) => {
  const { data } = await axiosInstance.post("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  const { token, user } = data.data;

  storeSession(token, user);

  return {
    token,
    user,
    roles: data.data.roles,
    refreshToken: data.data.refreshToken,
  };
};

/**
 * Logout – clears local session and optionally calls the server.
 */
export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch {
    // Best-effort – always clear local session
  } finally {
    clearSession();
  }
};

/**
 * Trigger a password-reset email.
 * POST /auth/forgot-password → { message }
 */
export const forgotPassword = async (email) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", {
    email: email.trim().toLowerCase(),
  });
  return data;
};

const authService = {
  login,
  logout,
  forgotPassword,
  isAuthenticated,
  getUser,
  getToken,
};
export default authService;
