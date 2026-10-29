import React, { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { toast } from "react-toastify";
import * as coachService from "../services/coachService";
import { useAuth } from "../context/AuthContext";
import AIAvatar from "./AIAvatar";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

/**
 * Floating AI Career Coach trigger - opens a FULL-SCREEN interface (not a
 * small popup) with voice input/output, persistent chat history, available
 * on every page via Layout.
 */
export default function AIAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [input, setInput] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOutputOn, setVoiceOutputOn] = useState(true);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const spokenCount = useRef(0);

  useEffect(() => {
    if (open && !chat) {
      coachService.getCoachChat().then((data) => setChat(data.chat)).catch(() => {});
    }
  }, [open, chat]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    if (!chat?.messages || !voiceOutputOn || !open) return;
    if (chat.messages.length <= spokenCount.current) return;
    const newMsgs = chat.messages.slice(spokenCount.current);
    spokenCount.current = chat.messages.length;
    const lastAi = [...newMsgs].reverse().find((m) => m.sender === "ai");
    if (!lastAi || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lastAi.text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.messages, voiceOutputOn, open]);

  useEffect(() => {
    if (!open) {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const text = input;
    setInput("");
    setInterimTranscript("");
    try {
      const data = await coachService.sendCoachMessage(text);
      setChat(data.chat);
    } catch (err) {
      toast.error(err.response?.data?.message || "Coach is unavailable right now");
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!SpeechRecognition) {
      toast.error("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t + " ";
        else interim += t;
      }
      setInterimTranscript(interim);
      setInput(finalTranscript.trim());
    };
    recognition.onerror = (event) => {
      const messages = { "not-allowed": "Microphone permission denied.", "no-speech": "No speech detected." };
      toast.error(messages[event.error] || `Voice input error: ${event.error}`);
      setListening(false);
    };
    recognition.onend = () => { setListening(false); setInterimTranscript(""); };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  if (!user) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-glow transition-transform hover:scale-105"
          title="AI Career Coach"
        >
          <Sparkles size={22} />
        </button>
      )}

      {/* Full-screen coach interface */}
      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-surface">
          <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
            <div className="flex items-center gap-3">
              <AIAvatar speaking={speaking} size={44} />
              <div>
                <p className="font-semibold">AI Career Coach</p>
                <p className="text-xs text-white/40">Resume · Coding · Interviews · Career planning</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setVoiceOutputOn((v) => !v)} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white" title="Toggle voice output">
                {voiceOutputOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white">
                <X size={20} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 overflow-y-auto px-6 py-6 scroll-thin">
            {!chat ? (
              <p className="text-center text-sm text-white/40">Loading...</p>
            ) : (
              chat.messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${m.sender === "user" ? "bg-brand text-white" : "bg-white/10 text-white/90"}`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
            {loading && <p className="text-xs text-white/40">Coach is typing...</p>}
          </div>

          <div className="mx-auto w-full max-w-3xl space-y-1.5 px-6 py-4">
            {interimTranscript && <p className="text-xs italic text-white/40">Listening: {interimTranscript}</p>}
            <div className="flex items-center gap-2 border-t border-surface-border pt-3">
              <button
                onClick={toggleVoiceInput}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${listening ? "animate-pulse bg-danger" : "bg-white/10 hover:bg-white/20"}`}
              >
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input
                className="input-field"
                placeholder="Ask about resume, coding, interviews, career..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend} disabled={loading || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white disabled:opacity-50">
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
