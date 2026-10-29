import React from "react";
import CodingEditor from "../components/CodingEditor";

export default function Coding() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Coding Assessment</h1>
      <p className="mb-6 text-white/60">
        Solve the problem in the editor below, then submit for an AI code review.
      </p>
      <CodingEditor />
    </div>
  );
}
