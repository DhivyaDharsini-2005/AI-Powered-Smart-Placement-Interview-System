import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";
import { Lightbulb, BookOpen, Zap, Bug, Play, Send, CheckCircle2, Sparkles } from "lucide-react";
import * as codingService from "../services/codingService";
import Loader from "./Loader";

const languages = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
];

const difficultyColor = { Easy: "badge-success", Medium: "badge-warning", Hard: "badge-danger" };
const monacoLang = { javascript: "javascript", python: "python", java: "java", cpp: "cpp", c: "c" };

export default function CodingEditor() {
  const [assignment, setAssignment] = useState(null);
  const [mode, setMode] = useState("mandatory"); // mandatory | practice
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [submitResults, setSubmitResults] = useState(null);
  const [assistText, setAssistText] = useState(null);
  const [assistLoading, setAssistLoading] = useState(null);

  useEffect(() => {
    loadAssignment();
  }, []);

  const loadAssignment = async () => {
    const data = await codingService.getAssignment();
    setAssignment(data);
    if (data.allMandatoryComplete) {
      setMode("practice");
      loadPracticeQuestions();
    } else {
      const firstIncomplete = data.mandatory.find((m) => !m.completed);
      selectQuestion(firstIncomplete.question, "mandatory");
    }
  };

  const loadPracticeQuestions = async () => {
    const data = await codingService.getCodingQuestions();
    setPracticeQuestions(data.questions);
    if (!selected) selectQuestion(data.questions[0], "practice");
  };

  const selectQuestion = (q, questionMode) => {
    setSelected(q);
    setMode(questionMode);
    setCode(q.starterCode?.[language] || "");
    setRunResults(null); setEvaluation(null); setSubmitResults(null); setAssistText(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (selected) setCode(selected.starterCode?.[lang] || "");
    setRunResults(null);
  };

  const handleRun = async () => {
    if (!selected) return;
    setRunning(true);
    setRunResults(null);
    try {
      const data = await codingService.runCode({ questionId: selected.id, language, code });
      setRunResults(data.results);
      const allPassed = data.results.every((r) => r.passed);
      toast[allPassed ? "success" : "warning"](allPassed ? "Sample test case(s) passed!" : "Some test cases failed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Run failed");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setEvaluation(null);
    setSubmitResults(null);
    try {
      const data = await codingService.submitCode({ questionId: selected.id, language, code });
      setEvaluation(data.record.aiEvaluation);
      setSubmitResults(data.executionResults);
      toast.success(data.isOfficial ? "Mandatory problem submitted!" : "Practice submission reviewed!");
      if (mode === "mandatory") {
        const fresh = await codingService.getAssignment();
        setAssignment(fresh);
        if (fresh.allMandatoryComplete) {
          toast.success("🎉 All 3 mandatory problems complete! Your Coding Score is locked in.");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const runAssist = async (type, fn) => {
    setAssistLoading(type);
    setAssistText(null);
    try {
      const data = await fn();
      setAssistText({ type, text: data.text });
    } catch (err) {
      toast.error(err.response?.data?.message || "AI assist failed");
    } finally {
      setAssistLoading(null);
    }
  };

  const startPracticeMode = () => {
    setMode("practice");
    loadPracticeQuestions();
  };

  if (!assignment) return <Loader label="Setting up your coding assessment..." />;

  return (
    <div className="space-y-4">
      {/* Mandatory progress banner */}
      {!assignment.allMandatoryComplete && mode === "mandatory" && (
        <div className="panel p-4">
          <p className="mb-3 text-sm font-semibold text-white/70">
            Mandatory Assessment - solve all 3 to unlock practice mode
          </p>
          <div className="flex flex-wrap gap-2">
            {assignment.mandatory.map((m) => (
              <button
                key={m.difficulty}
                onClick={() => selectQuestion(m.question, "mandatory")}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  selected?.id === m.question.id ? "border-brand bg-brand/10" : "border-surface-border bg-white/5 hover:border-white/30"
                }`}
              >
                {m.completed ? <CheckCircle2 size={14} className="text-success" /> : <span className={difficultyColor[m.difficulty]}>{m.difficulty}</span>}
                {m.question.title}
                {m.completed && <span className="text-xs text-success">{m.score}/100</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {assignment.allMandatoryComplete && mode === "mandatory" && (
        <div className="panel flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 size={20} /> <span className="font-semibold">All mandatory problems complete!</span>
          </div>
          <button onClick={startPracticeMode} className="btn-primary">
            <Sparkles size={16} /> Practice More Questions
          </button>
        </div>
      )}

      {mode === "practice" && (
        <div className="panel flex items-center justify-between p-3">
          <span className="badge-brand">Practice Mode - doesn't affect your official score</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        {/* Question list sidebar (practice mode only) */}
        {mode === "practice" && (
          <div className="panel max-h-[75vh] space-y-2 overflow-y-auto p-4 scroll-thin">
            <h3 className="mb-2 text-sm font-semibold text-white/60">Practice Questions</h3>
            {practiceQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => selectQuestion(q, "practice")}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selected?.id === q.id ? "bg-brand/20 text-white" : "text-white/70 hover:bg-white/10"
                }`}
              >
                <div className="font-medium">{q.title}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={difficultyColor[q.difficulty]}>{q.difficulty}</span>
                  {!q.supportsExecution && <span className="text-[10px] text-white/30">AI review only</span>}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Main editor panel */}
        <div className={`space-y-4 ${mode === "mandatory" ? "lg:col-span-2" : ""}`}>
          {selected && (
            <div className="panel p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{selected.title}</h2>
                <div className="flex items-center gap-1.5">
                  <span className={difficultyColor[selected.difficulty]}>{selected.difficulty}</span>
                  {selected.tags?.map((t) => <span key={t} className="badge-brand">{t}</span>)}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/60">{selected.description}</p>
              {selected.companyTags?.length > 0 && (
                <p className="mt-2 text-xs text-white/30">Asked by: {selected.companyTags.join(", ")}</p>
              )}
            </div>
          )}

          <div className="panel overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border bg-white/5 px-4 py-2">
              <select value={language} onChange={(e) => handleLanguageChange(e.target.value)} className="rounded-md bg-transparent text-sm text-white outline-none">
                {languages.map((l) => <option className="bg-surface" key={l.id} value={l.id}>{l.label}</option>)}
              </select>
              <div className="flex gap-2">
                {selected?.supportsExecution && (
                  <button onClick={handleRun} disabled={running} className="btn-secondary !py-1.5 !px-3 text-xs">
                    <Play size={13} /> {running ? "Running..." : "Run"}
                  </button>
                )}
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary !py-1.5 !px-3 text-xs">
                  <Send size={13} /> {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
            <Editor height="360px" theme="vs-dark" language={monacoLang[language]} value={code} onChange={(val) => setCode(val ?? "")} options={{ fontSize: 14, minimap: { enabled: false } }} />
          </div>

          <div className="flex flex-wrap gap-2">
            <AssistButton icon={Lightbulb} label="Hint" loading={assistLoading === "hint"} onClick={() => runAssist("hint", () => codingService.getHint(selected.id, code))} />
            <AssistButton icon={BookOpen} label="Explain" loading={assistLoading === "explain"} onClick={() => runAssist("explain", () => codingService.explainSolution(selected.id, code))} />
            <AssistButton icon={Zap} label="Optimize" loading={assistLoading === "optimize"} onClick={() => runAssist("optimize", () => codingService.optimizeCode(selected.id, language, code))} />
            <AssistButton icon={Bug} label="Find Bugs" loading={assistLoading === "bugs"} onClick={() => runAssist("bugs", () => codingService.detectBugs(selected.id, language, code))} />
          </div>

          {assistText && (
            <div className="panel space-y-1 p-4">
              <p className="text-xs font-semibold uppercase text-brand-light">{assistText.type}</p>
              <p className="whitespace-pre-wrap text-sm text-white/80">{assistText.text}</p>
            </div>
          )}

          {running && <Loader label="Executing your code via Judge0..." />}
          {runResults && !running && (
            <div className="panel space-y-2 p-4">
              <p className="text-sm font-semibold text-white/70">Sample Test Case Results</p>
              {runResults.map((r, i) => <TestCaseRow key={i} index={i} result={r} />)}
            </div>
          )}

          {submitting && <Loader label="Running all test cases + AI review..." />}
          {submitResults && !submitting && (
            <div className="panel space-y-2 p-4">
              <p className="text-sm font-semibold text-white/70">All Test Case Results (including hidden)</p>
              {submitResults.map((r, i) => <TestCaseRow key={i} index={i} result={r} />)}
            </div>
          )}

          {evaluation && !submitting && (
            <div className="panel space-y-4 p-6">
              <h3 className="text-base font-semibold">AI Code Review</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[["Correctness", evaluation.correctness], ["Efficiency", evaluation.efficiency], ["Approach", evaluation.approachQuality]].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-white/5 p-3">
                    <div className="text-xl font-bold text-brand-light">{value}</div>
                    <div className="text-xs text-white/50">{label}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/70">{evaluation.feedback}</p>
              {evaluation.improvements?.length > 0 && (
                <ul className="list-inside list-disc space-y-1 text-sm text-white/70">
                  {evaluation.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                </ul>
              )}
              <div className="text-right text-sm font-semibold text-white/80">
                Overall Score: <span className="text-brand-light">{evaluation.score}/100</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AssistButton({ icon: Icon, label, loading, onClick }) {
  return (
    <button onClick={onClick} disabled={loading} className="btn-secondary text-xs">
      <Icon size={13} /> {loading ? `${label}...` : label}
    </button>
  );
}

function TestCaseRow({ index, result }) {
  return (
    <div className={`rounded-lg p-3 text-xs ${result.passed ? "bg-success-soft" : "bg-danger-soft"}`}>
      <div className="flex items-center justify-between">
        <span className={`font-semibold ${result.passed ? "text-success" : "text-danger"}`}>
          {result.hidden ? `Hidden Case ${index + 1}` : `Case ${index + 1}`} {result.passed ? "✓ Passed" : "✗ Failed"}
        </span>
        {result.time && <span className="text-white/40">{result.time}s · {result.memory}KB</span>}
      </div>
      {!result.hidden && (
        <div className="mt-1.5 space-y-0.5 text-white/60">
          <p>Input: <code className="text-white/80">{result.input}</code></p>
          <p>Expected: <code className="text-white/80">{result.expectedOutput}</code></p>
          <p>Got: <code className="text-white/80">{result.actualOutput || "(empty)"}</code></p>
          {result.stderr && <p className="text-danger">Error: {result.stderr}</p>}
        </div>
      )}
    </div>
  );
}
