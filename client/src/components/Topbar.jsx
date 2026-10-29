import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Moon, Sun, ChevronDown, Menu, X, LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import * as notificationService from "../services/notificationService";
import { navItems } from "./navItems";

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userRef = useRef(null);

  const loadUnreadCount = async () => {
    try {
      const data = await notificationService.getNotifications();
      setUnreadCount(data.unreadCount);
    } catch {
      // silent - non-critical
    }
  };

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-border bg-surface/95 px-4 py-3 backdrop-blur lg:pl-6">
      <button
        onClick={() => setMobileNavOpen((o) => !o)}
        className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden"
      >
        {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Bell now navigates straight to a dedicated Notifications page */}
        <Link
          to="/notifications"
          className="relative rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/10"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="hidden text-sm font-medium text-white/90 sm:block">{user.name}</span>
            <ChevronDown size={14} className="hidden text-white/50 sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 panel py-1.5 shadow-card">
              <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
                <UserIcon size={14} /> Profile
              </Link>
              <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
                <SettingsIcon size={14} /> Settings
              </Link>
              <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileNavOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b border-surface-border bg-surface px-4 py-3 lg:hidden">
          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setMobileNavOpen(false)} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5">
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
