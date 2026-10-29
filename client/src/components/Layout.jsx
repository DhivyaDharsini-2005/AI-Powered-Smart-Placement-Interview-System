import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AIAssistant from "./AIAssistant";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main>{children}</main>
      </div>
      <AIAssistant />
    </div>
  );
}
