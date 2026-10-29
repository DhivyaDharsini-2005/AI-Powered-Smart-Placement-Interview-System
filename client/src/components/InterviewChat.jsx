import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Send, Mic, MicOff, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import * as interviewService from "../services/interviewService";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import AIAvatar from "./AIAvatar";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function InterviewChat({ onInterviewStart, onInterviewEnd, getEngagementSummary }) {
  const { user } = useAuth();
  const [mode, setMode] = useState("technical");
  const [role, setRole] = useState(user?.targetRole || "Software Development Engineer");
  const [interview, setInterview] = useState(null);
  const [input, setInput] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOutputOn, setVoiceOutputOn] = useState(true);
  const [evaluation, setEvaluation] = useState(null);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const spokenMessageCount = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [interview?.messages]);

  // --- Speak new AI messages automatically (Web Speech API TTS - free, browser-native) ---
  useEffect(() => {
    if (!interview?.messages || !voiceOutputOn) return;
    const messages = interview.messages;
    if (messages.length <= spokenMessageCount.current) return;

    const newMessages = messages.slice(spokenMessageCount.current);
    spokenMessageCount.current = messages.length;

    const lastAi = [...newMessages].reverse().find((m) => m.sender === "ai");
    if (!lastAi || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lastAi.text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview?.messages, voiceOutputOn]);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const handleStart = async () => {
    setLoading(true);
    setEvaluation(null);
    spokenMessageCount.current = 0;
    try {
      const data = await interviewService.startInterview({ mode, role });
      setInterview(data.interview);
      onInterviewStart?.(data.interview);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !interview) return;
    setLoading(true);
    const textToSend = input;
    setInput("");
    setInterimTranscript("");
    try {
      const data = await interviewService.sendInterviewMessage(interview._id, textToSend);
      setInterview(data.interview);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send answer");
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    if (!interview) return;
    setLoading(true);
    window.speechSynthesis?.cancel();
    try {
      const engagementSummary = getEngagementSummary?.();
      const data = await interviewService.endInterview(interview._id, engagementSummary);
      setInterview(data.interview);
      setEvaluation(data.interview.evaluation);
      onInterviewEnd?.(data.interview);
      toast.success("Interview evaluated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end interview");
    } finally {
      setLoading(false);
    }
  };

  // --- Continuous voice input with live transcript + proper error/permission handling ---
  const toggleVoiceInput = async () => {
    if (!SpeechRecognition) {
      toast.error("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    // Proactively check mic permission where supported, for a clearer error than the browser's default
    try {
      if (navigator.permissions?.query) {
        const status = await navigator.permissions.query({ name: "microphone" });
        if (status.state === "denied") {
          toast.error("Microphone access is blocked. Enable it in your browser's site settings and reload.");
          return;
        }
      }
    } catch {
      // permissions API not supported for 'microphone' in some browsers - just proceed
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true; // show live transcript as the user talks
    recognition.continuous = true; // keep listening across pauses instead of stopping after one phrase

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interim += transcript;
      }
      setInterimTranscript(interim);
      setInput((finalTranscript || "").trim());
    };

    recognition.onerror = (event) => {
      const messages = {
        "not-allowed": "Microphone permission denied. Allow mic access and try again.",
        "no-speech": "Didn't catch that - no speech detected.",
        "audio-capture": "No microphone found. Check your device's audio settings.",
        network: "Speech recognition network error - check your connection.",
      };
      toast.error(messages[event.error] || `Voice input error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      toast.error("Couldn't start voice input - try clicking the mic again.");
    }
  };

  // --- Setup screen ---
  if (!interview) {
    return (
      <div className="panel space-y-4 p-6">
        <h2 className="text-lg font-semibold">Start an AI Interview</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/70">Interview Mode</label>
          <div className="flex gap-2">
            {["technical", "hr"].map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${mode === m ? "bg-brand text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>
                {m === "hr" ? "HR / Behavioral" : "Technical"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/70">Target Role</label>
          <input className="input-field" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>

        <button onClick={handleStart} disabled={loading} className="btn-primary w-full">
          {loading ? "Starting..." : "Start Interview"}
        </button>
      </div>
    );
  }

  // --- Active chat screen ---
  return (
    <div className="flex h-[70vh] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AIAvatar speaking={speaking} size={44} />
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize text-white/70">
            {interview.mode} interview · {interview.role}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceOutputOn((v) => !v)}
            className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
            title={voiceOutputOn ? "Mute AI voice" : "Unmute AI voice"}
          >
            {voiceOutputOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          {!interview.completed && (
            <button onClick={handleEnd} disabled={loading} className="btn-secondary text-sm">End Interview</button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="panel flex-1 space-y-3 overflow-y-auto p-4 scroll-thin">
        {interview.messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm leading-relaxed ${m.sender === "user" ? "bg-brand text-white" : "bg-white/10 text-white/90"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <Loader label="Interviewer is thinking..." />}
      </div>

      {!interview.completed && (
        <div className="mt-3 space-y-1.5">
          {interimTranscript && (
            <p className="px-2 text-xs italic text-white/40">Listening: {interimTranscript}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoiceInput}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${listening ? "animate-pulse bg-danger" : "bg-white/10 hover:bg-white/20"}`}
              title="Voice input (continuous - click again to stop)"
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              className="input-field"
              placeholder={listening ? "Speak now..." : "Type your answer or use the mic..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand hover:bg-brand-dark disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {evaluation && (
        <div className="panel mt-4 space-y-3 p-5">
          <div className="flex items-center gap-2 text-base font-semibold">
            <CheckCircle2 className="text-success" size={20} />
            Interview Evaluation: {evaluation.score}/100
          </div>
          <p className="text-sm text-white/70">{evaluation.feedback}</p>
          {evaluation.strengths?.length > 0 && (
            <div>
              <p className="mb-1 text-sm font-semibold text-white/80">Strengths</p>
              <ul className="list-inside list-disc text-sm text-white/70">{evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
          {evaluation.weaknesses?.length > 0 && (
            <div>
              <p className="mb-1 text-sm font-semibold text-white/80">Weaknesses</p>
              <ul className="list-inside list-disc text-sm text-white/70">{evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}
          {interview.engagementSummary?.avgBlinkRate != null && (
            <div className="rounded-lg bg-white/5 p-3 text-xs text-white/50">
              <p className="mb-1 font-medium text-white/70">Engagement signals (approximate)</p>
              <p>Blink rate: {interview.engagementSummary.avgBlinkRate}/min · Looking away: {interview.engagementSummary.gazeAwayPercent}% of frames</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
