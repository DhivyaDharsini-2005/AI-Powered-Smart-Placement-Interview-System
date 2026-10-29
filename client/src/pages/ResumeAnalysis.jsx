import React, { useState } from "react";
import { toast } from "react-toastify";
import { Brain } from "lucide-react";
import ResumeUpload from "../components/ResumeUpload";
import * as mlService from "../services/mlService";
import Loader from "../components/Loader";

const qualityColor = { Good: "text-success", Average: "text-warning", "Needs Improvement": "text-danger" };

export default function ResumeAnalysis() {
  const [mlResult, setMlResult] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);

  const handleMlPredict = async () => {
    setMlLoading(true);
    try {
      const data = await mlService.getResumeQualityPrediction();
      setMlResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "ML service unreachable - is ml_service/app.py running?");
    } finally {
      setMlLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Resume ATS Analysis</h1>
      <p className="mb-6 text-white/50">
        Upload your resume as a PDF and Groq AI will score it against ATS criteria for your target role.
      </p>
      <ResumeUpload />

      <div className="panel mt-8 space-y-3 p-6">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Brain size={16} className="text-brand" /> ML Resume Quality Estimator
            <span className="badge-brand">Trained Model</span>
          </p>
          <button onClick={handleMlPredict} disabled={mlLoading} className="btn-secondary text-sm">
            {mlLoading ? "Predicting..." : "Run Prediction"}
          </button>
        </div>
        <p className="text-xs text-white/40">
          Uses your trained RandomForest + XGBoost ensemble model and your Profile fields (education,
          job role, experience, certifications). Category encodings are approximate until calibrated
          against your original training data - see ml_service/encoders_config.py.
        </p>
        {mlLoading && <Loader label="Running ML model..." />}
        {mlResult && !mlLoading && (
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <span className={`text-lg font-bold ${qualityColor[mlResult.qualityLevel]}`}>
              {mlResult.qualityLevel}
            </span>
            <div className="flex gap-3 text-xs text-white/60">
              {Object.entries(mlResult.probabilities).map(([label, pct]) => (
                <span key={label}>{label}: {pct}%</span>
              ))}
            </div>
            {!mlResult.calibrated && (
              <span className="badge-warning">Approximate - not yet calibrated</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
