import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Download, Sparkles, Brain } from "lucide-react";
import * as reportService from "../services/reportService";
import * as mlService from "../services/mlService";
import ResultDashboard from "../components/ResultDashboard";
import Loader from "../components/Loader";

const levelColor = {
  "Highly Ready": "text-success",
  Ready: "text-success",
  "Needs Improvement": "text-warning",
  "Not Ready": "text-danger",
};

const mlLevelColor = { High: "text-success", Medium: "text-warning", Low: "text-danger" };

export default function Report() {
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [mlResult, setMlResult] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await reportService.getReportHistory();
      setHistory(data.reports);
      if (data.reports?.length) setLatest(data.reports[0]);
    } catch {
      // non-fatal
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await reportService.generateReport();
      setLatest(data.report);
      setHistory((prev) => [data.report, ...prev]);
      toast.success("Report generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleMlPredict = async () => {
    setMlLoading(true);
    try {
      const data = await mlService.getPlacementPrediction();
      setMlResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "ML service unreachable - is ml_service/app.py running?");
    } finally {
      setMlLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      await reportService.downloadReportPDF(id);
    } catch {
      toast.error("Failed to download report");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Placement Readiness Report</h1>
          <p className="text-white/50">
            Combines your latest Resume, Aptitude, Coding, Technical and HR Interview scores.
          </p>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary">
          <Sparkles size={16} /> {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {loading && <Loader label="Combining scores and generating PDF..." />}

      {!loading && latest && (
        <div className="panel mb-6 grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand text-2xl font-bold">
                {latest.finalScore}
              </div>
              <p className={`mt-3 text-lg font-semibold ${levelColor[latest.jobReadinessLevel]}`}>
                {latest.jobReadinessLevel}
              </p>
              {latest.mlPlacementLevel && (
                <p className="mt-1 text-xs text-white/40">
                  ML Prediction: <span className={mlLevelColor[latest.mlPlacementLevel]}>{latest.mlPlacementLevel}</span>
                </p>
              )}
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <Row label="Resume" value={latest.resumeScore} />
              <Row label="Aptitude" value={latest.aptitudeScore} />
              <Row label="Coding" value={latest.codingScore} />
              <Row label="Technical Interview" value={latest.technicalInterviewScore} />
              <Row label="HR Interview" value={latest.hrInterviewScore} />
            </div>

            <button
              onClick={() => handleDownload(latest._id)}
              className="btn-secondary mt-5 flex w-full items-center justify-center gap-2"
            >
              <Download size={16} /> Download PDF
            </button>
          </div>

          <ResultDashboard
            resumeScore={latest.resumeScore}
            aptitudeScore={latest.aptitudeScore}
            codingScore={latest.codingScore}
            technicalInterviewScore={latest.technicalInterviewScore}
            hrInterviewScore={latest.hrInterviewScore}
          />
        </div>
      )}

      {!loading && !latest && !historyLoading && (
        <div className="panel mb-6 p-8 text-center text-white/50">
          No reports yet. Complete a few modules, then click "Generate Report".
        </div>
      )}

      {/* ML Placement Predictor card */}
      <div className="panel mb-6 space-y-3 p-6">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Brain size={16} className="text-brand" /> ML Placement Predictor
            <span className="badge-brand">Trained Model</span>
          </p>
          <button onClick={handleMlPredict} disabled={mlLoading} className="btn-secondary text-sm">
            {mlLoading ? "Predicting..." : "Run Prediction"}
          </button>
        </div>
        <p className="text-xs text-white/40">
          Uses your own trained RandomForest + XGBoost + GradientBoosting + ExtraTrees ensemble
          (running in a separate Python service) on your real scores and profile data.
        </p>
        {mlResult && (
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <span className={`text-lg font-bold ${mlLevelColor[mlResult.placementLevel]}`}>
              {mlResult.placementLevel} Placement Likelihood
            </span>
            <div className="flex gap-3 text-xs text-white/60">
              {Object.entries(mlResult.probabilities).map(([label, pct]) => (
                <span key={label}>{label}: {pct}%</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {history.length > 1 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Report History</h2>
          <div className="space-y-2">
            {history.slice(1).map((r) => (
              <div key={r._id} className="panel flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">
                    Final Score: {r.finalScore} -{" "}
                    <span className={levelColor[r.jobReadinessLevel]}>{r.jobReadinessLevel}</span>
                  </p>
                  <p className="text-xs text-white/40">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDownload(r._id)} className="btn-secondary text-sm">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/60">{label}</span>
      <span className="font-medium">{value}/100</span>
    </div>
  );
}
