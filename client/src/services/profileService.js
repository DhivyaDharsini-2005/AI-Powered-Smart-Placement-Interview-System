import api from "./api";

export const getMyProfile = () => api.get("/profile").then((r) => r.data);
export const updateMyProfile = (payload) => api.put("/profile", payload).then((r) => r.data);
export const changePassword = (payload) => api.put("/profile/password", payload).then((r) => r.data);
export const deleteMyAccount = () => api.delete("/profile").then((r) => r.data);

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return api
    .post("/profile/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};
