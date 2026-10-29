import api from "./api";

export const generateReport = () => api.post("/report/generate").then((r) => r.data);
export const getReportHistory = () => api.get("/report/history").then((r) => r.data);

// Downloads use a blob + auth header since the route is protected and a
// plain <a href> link wouldn't carry the JWT Authorization header.
export const downloadReportPDF = async (id) => {
  const response = await api.get(`/report/${id}/download`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `placement-report-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
