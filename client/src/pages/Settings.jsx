import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Moon, Sun, Bell, Shield, KeyRound, Trash2, Camera, Mic } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import * as profileService from "../services/profileService";
import Loader from "../components/Loader";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { user } = await profileService.getMyProfile();
        setPrefs(user.notificationPrefs || {});
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const togglePref = async (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    try {
      await profileService.updateMyProfile({ notificationPrefs: updated });
    } catch {
      toast.error("Failed to save preference");
    }
  };

  if (loading || !prefs) return <Loader label="Loading settings..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Appearance */}
      <div className="panel space-y-4 p-6">
        <h2 className="text-sm font-semibold text-white/70">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </div>
          <Toggle checked={theme === "dark"} onChange={toggleTheme} />
        </div>
      </div>

      {/* Notifications */}
      <div className="panel space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/70">
          <Bell size={16} /> Notification Preferences
        </h2>
        <PrefRow
          label="Resume score updates"
          checked={prefs.resumeUpdates}
          onChange={() => togglePref("resumeUpdates")}
        />
        <PrefRow
          label="Daily practice reminders"
          checked={prefs.practiceReminders}
          onChange={() => togglePref("practiceReminders")}
        />
        <PrefRow
          label="Achievement alerts"
          checked={prefs.achievementAlerts}
          onChange={() => togglePref("achievementAlerts")}
        />
      </div>

      {/* Privacy & permissions */}
      <div className="panel space-y-3 p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/70">
          <Shield size={16} /> Privacy & Permissions
        </h2>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Camera size={14} /> Camera access is requested only during AI Interview proctoring, and the
          video stream never leaves your browser - only blink/gaze signals are logged.
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Mic size={14} /> Microphone access (for voice answers) uses your browser's built-in speech
          recognition - no audio is uploaded anywhere.
        </div>
      </div>

      {/* Quick links */}
      <div className="panel space-y-3 p-6">
        <h2 className="text-sm font-semibold text-white/70">Account</h2>
        <Link to="/profile" className="flex items-center gap-2 text-sm text-white/70 hover:text-brand-light">
          <KeyRound size={14} /> Change password (in Profile)
        </Link>
        <Link to="/profile" className="flex items-center gap-2 text-sm text-danger hover:underline">
          <Trash2 size={14} /> Delete account (in Profile)
        </Link>
      </div>
    </div>
  );
}

function PrefRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/80">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-brand" : "bg-white/15"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
