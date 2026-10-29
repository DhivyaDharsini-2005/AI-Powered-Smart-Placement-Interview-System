import React from "react";
import AptitudeTest from "../components/AptitudeTest";

export default function Aptitude() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Aptitude Test</h1>
      <p className="mb-6 text-white/60">
        Take the full mandatory assessment, or practice any topic independently below.
      </p>
      <AptitudeTest />
    </div>
  );
}
