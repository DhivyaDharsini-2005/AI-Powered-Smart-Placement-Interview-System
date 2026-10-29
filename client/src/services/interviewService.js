import api from "./api";

export const startInterview = (payload) => api.post("/interview/start", payload).then((r) => r.data);
export const sendInterviewMessage = (id, text) =>
  api.post(`/interview/${id}/message`, { text }).then((r) => r.data);
export const endInterview = (id, engagementSummary) =>
  api.post(`/interview/${id}/end`, { engagementSummary }).then((r) => r.data);
export const logProctoringEvent = (id, type) =>
  api.post(`/interview/${id}/proctor`, { type }).then((r) => r.data);
export const getInterviewHistory = () => api.get("/interview/history").then((r) => r.data);
export const getInterviewById = (id) => api.get(`/interview/${id}`).then((r) => r.data);
