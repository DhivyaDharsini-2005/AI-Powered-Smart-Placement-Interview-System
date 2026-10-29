import React from "react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-white/70">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-brand" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
