const Resume = require("../models/Resume");
const Aptitude = require("../models/Aptitude");
const Coding = require("../models/Coding");
const Interview = require("../models/Interview");

// Shared score-aggregation helpers used by both the Report and ML controllers,
// so "what counts as your coding score" etc. stays consistent everywhere.

async function getLatestResumeScore(userId) {
  const resume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
  return resume?.atsScore || 0;
}

async function getAptitudeAverage(userId) {
  const records = await Aptitude.find({ user: userId, completed: true });
  if (!records.length) return 0;
  const total = records.reduce((sum, r) => sum + r.score, 0);
  return Math.round(total / records.length);
}

async function getCodingAverage(userId) {
  // Only the 3 mandatory (official) submissions count toward the score -
  // practice submissions are for learning only, per the mandatory-flow spec.
  const records = await Coding.find({ user: userId, isOfficial: true }).sort({ createdAt: -1 });
  if (!records.length) return 0;

  // If a mandatory question was resubmitted, use only its most recent attempt
  const latestPerQuestion = new Map();
  for (const r of records) {
    if (!latestPerQuestion.has(r.questionId)) latestPerQuestion.set(r.questionId, r);
  }
  const scores = [...latestPerQuestion.values()].map((r) => r.aiEvaluation?.score || 0);
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

// Interview scores are tracked separately for technical vs hr mode, since the
// reference report design (and the placement ML model) treat them as distinct.
async function getInterviewAverage(userId, mode) {
  const records = await Interview.find({ user: userId, completed: true, mode });
  if (!records.length) return 0;
  const total = records.reduce((sum, r) => sum + (r.evaluation?.score || 0), 0);
  return Math.round(total / records.length);
}

async function getAllScores(userId) {
  const [resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore] =
    await Promise.all([
      getLatestResumeScore(userId),
      getAptitudeAverage(userId),
      getCodingAverage(userId),
      getInterviewAverage(userId, "technical"),
      getInterviewAverage(userId, "hr"),
    ]);
  return { resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore };
}

module.exports = {
  getLatestResumeScore,
  getAptitudeAverage,
  getCodingAverage,
  getInterviewAverage,
  getAllScores,
};
