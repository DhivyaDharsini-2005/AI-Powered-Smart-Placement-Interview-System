import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { CheckCircle2, Circle, Sparkles, FileText, Brain, Code2, Bot, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as resumeService from "../services/resumeService";
import * as aptitudeService from "../services/aptitudeService";
import * as codingService from "../services/codingService";
import * as interviewService from "../services/interviewService";
import ResultDashboard from "../components/ResultDashboard";

const STEPS = [
  { key: "resume", label: "Resume Analysis" },
  { key: "aptitude", label: "Aptitude Test" },
  { key: "coding", label: "Coding Practice" },
  { key: "technical", label: "Technical Interview" },
  { key: "hr", label: "HR Interview" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [resumeRes, aptitudeRes, codingRes, interviewRes] = await Promise.all([
          resumeService.getResumeHistory(),
          aptitudeService.getAptitudeHistory(),
          codingService.getCodingHistory(),
          interviewService.getInterviewHistory(),
        ]);

        const resume = resumeRes.resumes?.[0];
        const aptitudeAvg = avg(aptitudeRes.records?.map((r) => r.score));
        const codingAvg = avg(codingRes.records?.map((r) => r.aiEvaluation?.score));
        const techInterviews = interviewRes.interviews?.filter((i) => i.mode === "technical" && i.completed);
        const hrInterviews = interviewRes.interviews?.filter((i) => i.mode === "hr" && i.completed);
        const techAvg = avg(techInterviews?.map((i) => i.evaluation?.score));
        const hrAvg = avg(hrInterviews?.map((i) => i.evaluation?.score));

        const overall = Math.round(
          (resume?.atsScore || 0) * 0.15 + aptitudeAvg * 0.2 + codingAvg * 0.25 + techAvg * 0.2 + hrAvg * 0.2
        );

        const feed = [
          ...(resumeRes.resumes || []).map((r) => ({ text: "Resume uploaded and analyzed", date: r.createdAt })),
          ...(aptitudeRes.records || []).map((r) => ({ text: `Aptitude test completed (${r.category})`, date: r.createdAt })),
          ...(codingRes.records || []).map((r) => ({ text: `Coding practice: ${r.questionTitle}`, date: r.createdAt })),
          ...(interviewRes.interviews || []).map((i) => ({
            text: `${i.mode === "technical" ? "Technical" : "HR"} interview ${i.completed ? "completed" : "started"}`,
            date: i.createdAt,
          })),
        ]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setStats({
          overall,
          resume: resume?.atsScore || 0,
          aptitude: aptitudeAvg,
          coding: codingAvg,
          technical: techAvg,
          hr: hrAvg,
          completedSteps: {
            resume: !!resume,
            aptitude: (aptitudeRes.records?.length || 0) > 0,
            coding: (codingRes.records?.length || 0) > 0,
            technical: (techInterviews?.length || 0) > 0,
            hr: (hrInterviews?.length || 0) > 0,
          },
        });
        setActivities(feed);
      } catch {
        // dashboard still renders with empty stats
      }
    })();
  }, []);

  if (!stats) return null;

  const weakest = ["resume", "aptitude", "coding", "technical", "hr"]
    .map((k) => ({ key: k, score: stats[k] }))
    .sort((a, b) => a.score - b.score)[0];

  const labelMap = { resume: "Resume", aptitude: "Aptitude", coding: "Coding", technical: "Technical Interview", hr: "HR Interview" };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold">
          {greeting()}, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-white/50">Track your progress and improve your skills</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Overall Score" value={stats.overall} color="#22c55e" />
        <StatCard label="Resume Score" value={stats.resume} color="#6366f1" />
        <StatCard label="Aptitude Score" value={stats.aptitude} color="#f59e0b" />
        <StatCard label="Coding Score" value={stats.coding} color="#3b82f6" />
        <StatCard label="Interview Score" value={Math.round((stats.technical + stats.hr) / 2)} color="#a855f7" />
      </div>

      <div className="panel p-6">
        <p className="mb-5 text-sm font-semibold text-white/70">Your Progress</p>
        <div className="flex items-center justify-between overflow-x-auto">
          {STEPS.map((step, i) => {
            const done = stats.completedSteps[step.key];
            return (
              <React.Fragment key={step.key}>
                <div className="flex min-w-[90px] flex-col items-center gap-2 text-center">
                  {done ? (
                    <CheckCircle2 className="text-success" size={26} />
                  ) : (
                    <Circle className="text-white/20" size={26} />
                  )}
                  <span className="text-xs font-medium text-white/70">{step.label}</span>
                  <span className={`text-[10px] ${done ? "text-success" : "text-white/30"}`}>
                    {done ? "Completed" : "Pending"}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-1 h-0.5 flex-1 ${done ? "bg-success" : "bg-white/10"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="panel p-6">
          <p className="mb-3 text-sm font-semibold text-white/70">Recent Activities</p>
          {activities.length === 0 ? (
            <p className="text-sm text-white/40">No activity yet - start with a Resume upload!</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((a, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-white/80">{a.text}</span>
                  <span className="shrink-0 text-xs text-white/40">{timeAgo(a.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-6">
          <p className="mb-1 text-sm font-semibold text-white/70">Performance Overview</p>
          <ResultDashboard
            resumeScore={stats.resume}
            aptitudeScore={stats.aptitude}
            codingScore={stats.coding}
            technicalInterviewScore={stats.technical}
            hrInterviewScore={stats.hr}
            compact
          />
        </div>

        <div className="panel space-y-3 p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Sparkles size={16} className="text-brand" /> AI Recommendation
          </p>
          <p className="text-sm text-white/70">
            {weakest.score < 60
              ? `Focus on improving your ${labelMap[weakest.key]} - it's currently your weakest area at ${weakest.score}/100. A bit of focused practice there will move your overall score the most.`
              : "Great consistent performance across the board! Keep practicing regularly to stay sharp before your placement season."}
          </p>
          <Link to={`/${weakest.key === "technical" || weakest.key === "hr" ? "interview" : weakest.key}`} className="btn-primary inline-flex text-sm">
            View Recommendations <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickLink to="/resume" icon={FileText} label="Resume" />
        <QuickLink to="/aptitude" icon={Brain} label="Aptitude" />
        <QuickLink to="/coding" icon={Code2} label="Coding" />
        <QuickLink to="/interview" icon={Bot} label="Interview" />
      </div>
    </div>
  );
}

function avg(arr) {
  const valid = (arr || []).filter((v) => typeof v === "number");
  if (!valid.length) return 0;
  return Math.round(valid.reduce((s, v) => s + v, 0) / valid.length);
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function StatCard({ label, value, color }) {
  const sparkData = Array.from({ length: 8 }, (_, i) => ({ v: Math.max(10, value - (7 - i) * (Math.random() * 4)) }));
  return (
    <div className="panel p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-bold">
        {value}<span className="text-sm text-white/40">/100</span>
      </p>
      <div className="mt-2 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="panel panel-hover flex items-center gap-3 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand-light">
        <Icon size={18} />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
