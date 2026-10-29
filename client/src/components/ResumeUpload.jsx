import React, { useState } from "react";
import { toast } from "react-toastify";
import { UploadCloud, FileText } from "lucide-react";
import * as resumeService from "../services/resumeService";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ResumeUpload({ onAnalyzed }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Software Development Engineer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose a PDF resume first");
      return;
    }
    setLoading(true);
    try {
      const data = await resumeService.uploadResume(file, targetRole);
      setResult(data.resume);
      onAnalyzed?.(data.resume);
      toast.success("Resume analyzed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/70">Target Role</label>
          <input
            className="input-field"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Frontend Developer"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/70">Resume (PDF only)</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center transition-colors hover:border-brand">
            <UploadCloud className="text-brand" size={28} />
            <span className="text-sm text-white/70">
              {file ? file.name : "Click to choose a PDF file (max 5MB)"}
            </span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Analyzing with AI..." : "Analyze Resume"}
        </button>
      </form>

      {loading && <Loader label="Groq AI is reviewing your resume against ATS criteria..." />}

      {result && !loading && (
        <div className="card space-y-5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand text-xl font-bold">
              {result.atsScore}
            </div>
            <div>
              <p className="text-sm text-white/60">ATS Score for "{result.targetRole}"</p>
              <p className="flex items-center gap-1 text-sm text-white/50">
                <FileText size={14} /> {result.fileName}
              </p>
            </div>
          </div>

          {result.missingKeywords?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-white/80">Missing Keywords</p>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, i) => (
                  <span key={i} className="rounded-full bg-brand/20 px-3 py-1 text-xs text-brand">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.strengths?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-white/80">Strengths</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-white/70">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {result.weaknesses?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-white/80">Weaknesses</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-white/70">
                {result.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-white/80">Improvement Suggestions</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-white/70">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
