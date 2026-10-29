import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { Clock, Flag, CheckCircle2, XCircle, AlertTriangle, Sparkles, Trophy, RotateCcw } from "lucide-react";
import * as aptitudeService from "../services/aptitudeService";
import Loader from "./Loader";

const difficultyBadge = { easy: "badge-success", medium: "badge-warning", hard: "badge-danger" };

export default function AptitudeTest() {
  const [categories, setCategories] = useState([]);
  const [topicBest, setTopicBest] = useState({});
  const [session, setSession] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const submittedRef = useRef(false);

  const loadLanding = () => {
    aptitudeService.getCategories().then((data) => setCategories(data.categories));
    aptitudeService.getTopicBest().then((data) => setTopicBest(data.bestByTopic)).catch(() => {});
  };

  useEffect(() => { loadLanding(); }, []);

  const doSubmit = useCallback(async (sessionId) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setLoading(true);
    try {
      const data = await aptitudeService.submitTest(sessionId);
      setResult(data.result);
      setSession(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit test");
      submittedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || result) return;
    setSecondsLeft(session.secondsRemaining);
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          doSubmit(session._id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?._id]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleStartFull = async () => {
    setLoading(true);
    setResult(null);
    submittedRef.current = false;
    try {
      const data = await aptitudeService.startFullTest();
      setSession(data.session);
      setCurrent(0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTopic = async (category) => {
    setLoading(true);
    setResult(null);
    submittedRef.current = false;
    try {
      const data = await aptitudeService.startTopicTest(category);
      setSession(data.session);
      setCurrent(0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start practice test");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (selectedIndex) => {
    setSession((s) => {
      const responses = [...s.responses];
      responses[current] = { ...responses[current], selectedIndex };
      return { ...s, responses };
    });
    try {
      await aptitudeService.answerQuestion(session._id, current, selectedIndex);
    } catch {
      toast.error("Auto-save failed - check your connection");
    }
  };

  const handleFlag = async () => {
    const newFlag = !session.responses[current].flaggedForReview;
    setSession((s) => {
      const responses = [...s.responses];
      responses[current] = { ...responses[current], flaggedForReview: newFlag };
      return { ...s, responses };
    });
    await aptitudeService.flagQuestion(session._id, current, newFlag);
  };

  const unansweredCount = session ? session.responses.filter((r) => r.selectedIndex === null).length : 0;

  const handleSubmitClick = () => {
    if (unansweredCount > 0) setConfirmSubmit(true);
    else doSubmit(session._id);
  };

  // --- Landing screen: Full Test + Topic Practice cards ---
  if (!session && !result) {
    return (
      <div className="space-y-6">
        {/* Full Aptitude Test - separate, prominent entry point */}
        <div className="panel space-y-3 border-brand/30 bg-gradient-to-br from-brand/10 to-transparent p-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-brand" size={20} />
            <h2 className="text-lg font-semibold">Full Aptitude Test</h2>
          </div>
          <p className="text-sm text-white/60">
            25 questions randomly drawn across all 15 topics below. Full-screen, 30-minute timer,
            question palette, Mark for Review - just like a real placement assessment. This is the
            test that counts toward your official Aptitude Score.
          </p>
          <button onClick={handleStartFull} disabled={loading} className="btn-primary">
            <Sparkles size={16} /> {loading ? "Building test..." : "Start Full Aptitude Test"}
          </button>
        </div>

        {/* Topic practice cards */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">Practice by Topic</h2>
          <p className="mb-4 text-sm text-white/60">
            Each topic has its own independent 20-question practice test with its own score - retake
            any topic as many times as you like. These don't affect your official Aptitude Score.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const best = topicBest[cat];
              return (
                <button
                  key={cat}
                  onClick={() => handleStartTopic(cat)}
                  disabled={loading}
                  className="rounded-xl border border-surface-border bg-white/5 px-4 py-4 text-left transition-colors hover:border-brand hover:bg-brand/10"
                >
                  <p className="text-sm font-medium">{cat}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                    {best ? (
                      <>
                        <span>Best: <span className="text-success font-medium">{best.score}%</span></span>
                        <span className="flex items-center gap-1"><RotateCcw size={11} /> Retake ({best.attempts} attempt{best.attempts > 1 ? "s" : ""})</span>
                      </>
                    ) : (
                      <span>20 questions - not attempted yet</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- Result / review screen ---
  if (result) {
    return (
      <div className="space-y-5">
        <div className="panel space-y-4 p-6 text-center">
          <h2 className="text-lg font-semibold">
            {result.mode === "full" ? "Full Aptitude Test Complete" : `${result.category} Practice Complete`}
          </h2>
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand text-2xl font-bold">
            {result.score}%
          </div>
          <p className="text-white/70">{result.correctCount} / {result.totalQuestions} correct - Accuracy: {result.accuracy}%</p>
          <button onClick={() => { setResult(null); loadLanding(); }} className="btn-primary">Back to Aptitude Hub</button>
        </div>

        {result.aiFeedback && (
          <div className="panel space-y-3 p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white/70">
              <Sparkles size={16} className="text-brand" /> AI-Generated Feedback
            </h3>
            <p className="text-sm text-white/80">{result.aiFeedback.feedback}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {result.aiFeedback.strengths?.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-success">Strengths</p>
                  <ul className="list-inside list-disc text-xs text-white/60">{result.aiFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              )}
              {result.aiFeedback.weakAreas?.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-warning">Weak Areas</p>
                  <ul className="list-inside list-disc text-xs text-white/60">{result.aiFeedback.weakAreas.map((w, i) => <li key={i}>{w}</li>)}</ul>
                </div>
              )}
              {result.aiFeedback.nextSteps?.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-brand-light">Next Steps</p>
                  <ul className="list-inside list-disc text-xs text-white/60">{result.aiFeedback.nextSteps.map((n, i) => <li key={i}>{n}</li>)}</ul>
                </div>
              )}
            </div>
          </div>
        )}

        {result.topicBreakdown?.length > 0 && (
          <div className="panel p-6">
            <h3 className="mb-3 text-sm font-semibold text-white/70">Topic-wise Performance</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {result.topicBreakdown.map((t) => (
                <div key={t.topic} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span className="text-white/70">{t.topic}</span>
                  <span className="font-medium">{t.correct}/{t.attempted}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="panel divide-y divide-surface-border">
          <h3 className="px-6 py-4 text-sm font-semibold text-white/70">Review & Explanations</h3>
          {result.review.map((q, i) => (
            <div key={i} className="space-y-2 px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/40">Question {i + 1} · {q.category}</span>
                <span className={difficultyBadge[q.difficulty]}>{q.difficulty}</span>
              </div>
              <p className="text-sm font-medium">{q.questionText}</p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctIndex;
                  const isSelected = oi === q.selectedIndex;
                  return (
                    <div key={oi} className={`rounded-lg px-3 py-1.5 text-xs ${isCorrect ? "bg-success-soft text-success" : isSelected ? "bg-danger-soft text-danger" : "bg-white/5 text-white/60"}`}>
                      {opt} {isCorrect && "✓"} {isSelected && !isCorrect && "✗"}
                    </div>
                  );
                })}
              </div>
              <p className="flex items-start gap-1.5 text-xs text-white/50">
                {q.isCorrect ? <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-success" /> : <XCircle size={14} className="mt-0.5 shrink-0 text-danger" />}
                {q.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Active test screen - FULL SCREEN OVERLAY (covers sidebar/topbar entirely) ---
  const question = session.questions[current];
  const response = session.responses[current];
  const answeredCount = session.responses.filter((r) => r.selectedIndex !== null).length;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-surface p-4 sm:p-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
        <div className="panel space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/60">
            <span className="badge-brand">{session.mode === "full" ? "Full Aptitude Test" : `${session.category} Practice`}</span>
            <span className={`flex items-center gap-1 font-semibold ${secondsLeft < 120 ? "text-danger" : "text-white/70"}`}>
              <Clock size={14} /> {formatTime(secondsLeft)}
            </span>
            <span>Question {current + 1} / {session.totalQuestions}</span>
            <span className={difficultyBadge[question.difficulty]}>{question.difficulty}</span>
          </div>

          <h3 className="text-base font-medium leading-relaxed">{question.questionText}</h3>

          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  response.selectedIndex === i ? "border-brand bg-brand/15 text-white" : "border-surface-border bg-white/5 text-white/80 hover:border-white/30"
                }`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button onClick={handleFlag} className={`btn-secondary text-sm ${response.flaggedForReview ? "border-warning text-warning" : ""}`}>
              <Flag size={14} /> {response.flaggedForReview ? "Marked for Review" : "Mark for Review"}
            </button>
            <div className="flex gap-2">
              <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} className="btn-secondary text-sm">Previous</button>
              {current < session.totalQuestions - 1 ? (
                <button onClick={() => setCurrent((c) => c + 1)} className="btn-primary text-sm">Next</button>
              ) : (
                <button onClick={handleSubmitClick} disabled={loading} className="btn-primary text-sm">
                  {loading ? "Submitting..." : "Submit Test"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="panel space-y-4 p-5">
          <div>
            <p className="text-sm font-semibold text-white/70">Test Progress</p>
            <p className="text-2xl font-bold text-brand">{answeredCount}<span className="text-base text-white/40">/{session.totalQuestions}</span></p>
            <p className="text-xs text-white/40">Questions Attempted</p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {session.questions.map((_, i) => {
              const r = session.responses[i];
              const isCurrent = i === current;
              const answered = r.selectedIndex !== null;
              let style = "bg-white/5 text-white/50 border-surface-border";
              if (isCurrent) style = "bg-brand text-white border-brand";
              else if (r.flaggedForReview) style = "bg-warning-soft text-warning border-warning/40";
              else if (answered) style = "bg-success-soft text-success border-success/40";
              return (
                <button key={i} onClick={() => setCurrent(i)} className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${style}`}>
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 text-xs text-white/50">
            <Legend color="bg-success" label="Answered" />
            <Legend color="bg-brand" label="Current" />
            <Legend color="bg-warning" label="Marked for review" />
            <Legend color="bg-white/20" label="Not answered" />
          </div>

          <button onClick={handleSubmitClick} disabled={loading} className="btn-primary w-full text-sm">
            {loading ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
          <div className="panel max-w-sm space-y-4 p-6 text-center">
            <AlertTriangle className="mx-auto text-warning" size={32} />
            <p className="font-semibold">
              You have {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}.
            </p>
            <p className="text-sm text-white/60">All questions must be answered for the most accurate score. Submit anyway?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmSubmit(false)} className="btn-secondary flex-1">Go Back</button>
              <button onClick={() => { setConfirmSubmit(false); doSubmit(session._id); }} className="btn-primary flex-1">Submit Anyway</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
}
