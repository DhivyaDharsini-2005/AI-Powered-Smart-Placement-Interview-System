import api from "./api";

export const uploadResume = (file, targetRole) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("targetRole", targetRole);
  return api
    .post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const getResumeHistory = () => api.get("/resume/history").then((r) => r.data);
export const getLatestResume = () => api.get("/resume/latest").then((r) => r.data);
