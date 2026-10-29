import api from "./api";

export const getAssignment = () => api.get("/coding/assignment").then((r) => r.data);
export const getCodingQuestions = () => api.get("/coding/questions").then((r) => r.data);
export const getCodingQuestion = (id) => api.get(`/coding/questions/${id}`).then((r) => r.data);
export const runCode = (payload) => api.post("/coding/run", payload).then((r) => r.data);
export const submitCode = (payload) => api.post("/coding/submit", payload).then((r) => r.data);
export const getCodingHistory = () => api.get("/coding/history").then((r) => r.data);

export const getHint = (questionId, code) => api.post("/coding/hint", { questionId, code }).then((r) => r.data);
export const explainSolution = (questionId, code) => api.post("/coding/explain", { questionId, code }).then((r) => r.data);
export const optimizeCode = (questionId, language, code) =>
  api.post("/coding/optimize", { questionId, language, code }).then((r) => r.data);
export const detectBugs = (questionId, language, code) =>
  api.post("/coding/detect-bugs", { questionId, language, code }).then((r) => r.data);
