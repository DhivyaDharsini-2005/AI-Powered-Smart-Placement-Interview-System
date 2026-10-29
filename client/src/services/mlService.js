import api from "./api";

// Wraps the Node backend's /api/ml routes, which in turn call the Python
// Flask microservice serving the trained placement + resume-quality models.
export const getPlacementPrediction = () => api.get("/ml/placement-prediction").then((r) => r.data);
export const getResumeQualityPrediction = (recruiterDecision) =>
  api.post("/ml/resume-quality", { recruiter_decision: recruiterDecision }).then((r) => r.data);
