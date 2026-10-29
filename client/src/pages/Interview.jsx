import React, { useRef, useState } from "react";
import InterviewChat from "../components/InterviewChat";
import ProctoringCam from "../components/ProctoringCam";

export default function Interview() {
  const [activeInterviewId, setActiveInterviewId] = useState(null);
  const latestEngagement = useRef(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">AI Interview Practice</h1>
      <p className="mb-6 text-white/50">
        Practice a technical or HR interview with a strict AI interviewer. Your webcam runs free,
        local blink-rate and gaze signals during the session (approximate, not a confidence score).
      </p>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        <InterviewChat
          onInterviewStart={(interview) => setActiveInterviewId(interview._id)}
          onInterviewEnd={() => setActiveInterviewId(null)}
          getEngagementSummary={() => latestEngagement.current}
        />
        <ProctoringCam
          interviewId={activeInterviewId}
          onEngagementUpdate={(data) => { latestEngagement.current = data; }}
        />
      </div>
    </div>
  );
}
