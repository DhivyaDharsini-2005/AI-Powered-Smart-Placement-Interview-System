/**
 * Combines the five module scores into one final placement-readiness score.
 * Technical and HR interview performance are now tracked separately (matching
 * the reference report design), each weighted half of what "Interview" used
 * to be worth as a single combined category.
 */
const WEIGHTS = {
  resume: 0.15,
  aptitude: 0.2,
  coding: 0.25,
  technicalInterview: 0.2,
  hrInterview: 0.2,
};

function computeFinalScore({
  resumeScore = 0,
  aptitudeScore = 0,
  codingScore = 0,
  technicalInterviewScore = 0,
  hrInterviewScore = 0,
}) {
  const weighted =
    resumeScore * WEIGHTS.resume +
    aptitudeScore * WEIGHTS.aptitude +
    codingScore * WEIGHTS.coding +
    technicalInterviewScore * WEIGHTS.technicalInterview +
    hrInterviewScore * WEIGHTS.hrInterview;

  return Math.round(weighted);
}

function getJobReadinessLevel(finalScore) {
  if (finalScore >= 85) return "Highly Ready";
  if (finalScore >= 65) return "Ready";
  if (finalScore >= 40) return "Needs Improvement";
  return "Not Ready";
}

function deriveStrengthsWeaknesses({ resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore }) {
  const modules = [
    { label: "Resume / ATS optimization", score: resumeScore },
    { label: "Aptitude reasoning", score: aptitudeScore },
    { label: "Coding & problem solving", score: codingScore },
    { label: "Technical interview knowledge", score: technicalInterviewScore },
    { label: "HR / behavioral communication", score: hrInterviewScore },
  ];

  const strengths = modules.filter((m) => m.score >= 70).map((m) => m.label);
  const weaknesses = modules.filter((m) => m.score < 60).map((m) => m.label);

  return { strengths, weaknesses };
}

module.exports = { computeFinalScore, getJobReadinessLevel, deriveStrengthsWeaknesses, WEIGHTS };
