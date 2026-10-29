import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bell, CheckCheck, Trash2, Circle } from "lucide-react";
import * as notificationService from "../services/notificationService";
import Loader from "../components/Loader";

const FILTERS = ["all", "unread", "read"];

const typeIcon = {
  resume_score: "📄",
  coding_progress: "💻",
  practice_reminder: "⏰",
  interview_scheduled: "🎤",
  hr_ready: "✅",
  daily_goal: "🎯",
  weak_skill: "⚠️",
  new_questions: "🆕",
  resume_outdated: "📝",
  congratulations: "🎉",
  achievement: "🏆",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
    } catch {
      toast.error("Failed to load notifications");
      setNotifications([]);
    }
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    load();
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    load();
  };

  const handleDelete = async (id) => {
    await notificationService.deleteNotification(id);
    load();
  };

  if (!notifications) return <Loader label="Loading notifications..." />;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Bell size={22} className="text-brand" /> Notifications
          </h1>
          <p className="text-white/50">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary text-sm">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-brand text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="panel p-8 text-center text-white/40">
          No {filter !== "all" ? filter : ""} notifications.
        </div>
      ) : (
        <div className="panel divide-y divide-surface-border">
          {filtered.map((n) => (
            <div key={n._id} className={`flex items-start gap-3 px-5 py-4 ${!n.read ? "bg-brand/5" : ""}`}>
              <span className="mt-0.5 text-lg">{typeIcon[n.type] || "🔔"}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {!n.read && <Circle size={6} className="fill-brand text-brand" />}
                  <p className="text-sm font-semibold text-white/90">{n.title}</p>
                </div>
                <p className="mt-0.5 text-sm text-white/60">{n.message}</p>
                <p className="mt-1 text-xs text-white/30">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-success"
                    title="Mark as read"
                  >
                    <CheckCheck size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n._id)}
                  className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-danger"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
