import React from "react";
import { Bot } from "lucide-react";

/**
 * A simple animated avatar whose "mouth" pulses while `speaking` is true.
 * This is an HONEST approximation, not true phoneme-level lip-sync - real
 * lip-sync needs viseme timing data from a TTS engine (most free browser
 * TTS doesn't expose that). What this gives instead: a smooth, clearly-
 * alive "talking" animation that starts/stops in sync with actual speech
 * audio (driven by SpeechSynthesis onstart/onend/onboundary events), which
 * reads as natural without overclaiming precision it doesn't have.
 */
export default function AIAvatar({ speaking, size = 64 }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-glow"
      style={{ width: size, height: size }}
    >
      <Bot size={size * 0.5} />

      {/* Speaking pulse rings */}
      {speaking && (
        <>
          <span className="absolute inset-0 rounded-full border-2 border-brand-light/60 animate-ping" />
          <span className="absolute -inset-1 rounded-full border border-brand-light/30 animate-pulse" />
        </>
      )}

      {/* Mouth indicator - oscillates while speaking */}
      <span
        className={`absolute bottom-1.5 left-1/2 h-1.5 -translate-x-1/2 rounded-full bg-white/90 transition-all ${
          speaking ? "animate-speak-mouth" : "w-3"
        }`}
        style={{ width: speaking ? undefined : size * 0.18 }}
      />

      <style>{`
        @keyframes speak-mouth {
          0%, 100% { width: ${size * 0.12}px; height: 3px; }
          25% { width: ${size * 0.22}px; height: 7px; }
          50% { width: ${size * 0.16}px; height: 5px; }
          75% { width: ${size * 0.24}px; height: 8px; }
        }
        .animate-speak-mouth { animation: speak-mouth 0.35s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
