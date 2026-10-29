import api from "./api";

export const register = (payload) => api.post("/auth/register", payload).then((r) => r.data);
export const login = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const googleLogin = (idToken) => api.post("/auth/google", { idToken }).then((r) => r.data);
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email }).then((r) => r.data);
export const resetPassword = (token, newPassword) =>
  api.post(`/auth/reset-password/${token}`, { newPassword }).then((r) => r.data);
export const getProfile = () => api.get("/auth/profile").then((r) => r.data);
export const updateProfile = (payload) => api.put("/auth/profile", payload).then((r) => r.data);
