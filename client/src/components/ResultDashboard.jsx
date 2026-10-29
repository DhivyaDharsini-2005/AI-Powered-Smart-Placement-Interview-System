import React from "react";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function ResultDashboard({
  resumeScore = 0,
  aptitudeScore = 0,
  codingScore = 0,
  technicalInterviewScore = 0,
  hrInterviewScore = 0,
  compact = false,
}) {
  const data = {
    labels: ["Resume", "Aptitude", "Coding", "Technical Interview", "HR Interview"],
    datasets: [
      {
        label: "Your Score",
        data: [resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore],
        backgroundColor: "rgba(99, 102, 241, 0.25)",
        borderColor: "#6366f1",
        borderWidth: 2,
        pointBackgroundColor: "#6366f1",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: "rgba(255,255,255,0.1)" },
        grid: { color: "rgba(255,255,255,0.1)" },
        pointLabels: { color: "rgba(255,255,255,0.8)", font: { size: compact ? 10 : 12 } },
        ticks: { color: "rgba(255,255,255,0.4)", backdropColor: "transparent", stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: compact ? 260 : 320 }}>
      <Radar data={data} options={options} />
    </div>
  );
}
