import api from "./api";

export const getCoachChat = () => api.get("/coach").then((r) => r.data);
export const sendCoachMessage = (text) => api.post("/coach/message", { text }).then((r) => r.data);
