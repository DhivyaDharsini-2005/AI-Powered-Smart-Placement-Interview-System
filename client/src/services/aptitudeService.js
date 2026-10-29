import api from "./api";

export const getCategories = () => api.get("/aptitude/categories").then((r) => r.data);
export const startFullTest = () => api.post("/aptitude/start", { mode: "full" }).then((r) => r.data);
export const startTopicTest = (category) => api.post("/aptitude/start", { mode: "topic", category }).then((r) => r.data);
export const getSession = (id) => api.get(`/aptitude/${id}`).then((r) => r.data);
export const answerQuestion = (id, index, selectedIndex) =>
  api.patch(`/aptitude/${id}/answer`, { index, selectedIndex }).then((r) => r.data);
export const flagQuestion = (id, index, flagged) =>
  api.patch(`/aptitude/${id}/flag`, { index, flagged }).then((r) => r.data);
export const submitTest = (id) => api.post(`/aptitude/${id}/submit`).then((r) => r.data);
export const getAptitudeHistory = () => api.get("/aptitude/history").then((r) => r.data);
export const getTopicBest = () => api.get("/aptitude/topic-best").then((r) => r.data);
