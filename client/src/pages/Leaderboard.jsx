import React, { useEffect, useState } from "react";
import { Trophy, Medal } from "lucide-react";
import * as leaderboardService from "../services/leaderboardService";
import Loader from "../components/Loader";

const medalColor = { 1: "text-yellow-400", 2: "text-slate-300", 3: "text-amber-600" };

export default function Leaderboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    leaderboardService.getLeaderboard().then(setData).catch(() => setData({ leaderboard: [], yourRank: null }));
  }, []);

  if (!data) return <Loader label="Loading leaderboard..." />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Trophy className="text-brand" size={24} /> Leaderboard
          </h1>
          <p className="text-white/50">Ranked by best Placement Readiness Report score.</p>
        </div>
        {data.yourRank && (
          <span className="badge-brand text-sm">Your rank: #{data.yourRank}</span>
        )}
      </div>

      {data.leaderboard.length === 0 ? (
        <div className="panel p-8 text-center text-white/50">
          No reports generated yet - be the first! Generate a report from the Reports page.
        </div>
      ) : (
        <div className="panel divide-y divide-surface-border">
          {data.leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between px-5 py-3.5 ${entry.isYou ? "bg-brand/10" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 text-center text-sm font-bold ${medalColor[entry.rank] || "text-white/40"}`}>
                  {entry.rank <= 3 ? <Medal size={18} className="inline" /> : entry.rank}
                </span>
                <span className="font-medium">
                  {entry.name} {entry.isYou && <span className="text-xs text-brand-light">(You)</span>}
                </span>
              </div>
              <span className="font-semibold text-brand-light">{entry.score}/100</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
