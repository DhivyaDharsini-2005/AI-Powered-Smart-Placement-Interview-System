import {
  LayoutDashboard,
  FileText,
  Brain,
  Code2,
  Bot,
  BarChart3,
  User,
  Settings,
  Trophy,
} from "lucide-react";

export const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/resume", label: "Resume Analysis", icon: FileText },
  { to: "/aptitude", label: "Aptitude Test", icon: Brain },
  { to: "/coding", label: "Coding Practice", icon: Code2 },
  { to: "/interview", label: "AI Interview", icon: Bot },
  { to: "/report", label: "Reports", icon: BarChart3 },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];
