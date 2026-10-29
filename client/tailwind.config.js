/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366f1", // indigo-500 - primary accent (buttons, active states)
          dark: "#4f46e5",
          light: "#818cf8",
          glow: "rgba(99, 102, 241, 0.25)",
        },
        success: { DEFAULT: "#22c55e", soft: "rgba(34,197,94,0.15)" },
        warning: { DEFAULT: "#f59e0b", soft: "rgba(245,158,11,0.15)" },
        info: { DEFAULT: "#3b82f6", soft: "rgba(59,130,246,0.15)" },
        danger: { DEFAULT: "#ef4444", soft: "rgba(239,68,68,0.15)" },
        // Dark navy surface system (matches the reference dashboard)
        surface: {
          DEFAULT: "#0b0c18", // page background
          panel: "#121324", // card background
          raised: "#171933", // hover/raised card
          border: "rgba(255,255,255,0.08)",
        },
        // Light mode surfaces
        light: {
          bg: "#f5f6fb",
          panel: "#ffffff",
          border: "rgba(15,15,35,0.08)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99,102,241,0.15), 0 8px 24px -8px rgba(99,102,241,0.35)",
        card: "0 4px 24px -8px rgba(0,0,0,0.45)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
    },
  },
  plugins: [],
};
