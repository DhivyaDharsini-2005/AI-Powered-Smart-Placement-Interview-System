const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");
const Aptitude = require("../models/Aptitude");
const Coding = require("../models/Coding");
const Interview = require("../models/Interview");
const Report = require("../models/Report");
const { generateReportPDF } = require("../utils/pdfGenerator");
const { getAllScores } = require("../services/statsService");
const { predictPlacement } = require("../services/mlService");
const { generateRoadmap } = require("../services/roadmapAI");
const { notify } = require("../services/notificationService");
const {
  computeFinalScore, getJobReadinessLevel, deriveStrengthsWeaknesses,
} = require("../services/scoringService");

// Recomputes a topic-wise breakdown from a stored Aptitude doc's raw
// questions+responses (works for both 'full' and 'topic' mode sessions).
function buildTopicBreakdown(aptitudeDoc) {
  if (!aptitudeDoc) return [];
  const topicMap = {};
  aptitudeDoc.questions.forEach((q, i) => {
    const isCorrect = aptitudeDoc.responses[i].selectedIndex === q.correctIndex;
    if (!topicMap[q.category]) topicMap[q.category] = { attempted: 0, correct: 0 };
    topicMap[q.category].attempted += 1;
    if (isCorrect) topicMap[q.category].correct += 1;
  });
  return Object.entries(topicMap).map(([topic, stats]) => ({ topic, ...stats }));
}

// Picks the latest official submission per difficulty for the 3 mandatory coding problems
async function getOfficialCodingSubmissions(userId) {
  const records = await Coding.find({ user: userId, isOfficial: true }).sort({ createdAt: -1 });
  const seen = new Set();
  const latest = [];
  for (const r of records) {
    if (!seen.has(r.questionId)) {
      seen.add(r.questionId);
      latest.push(r);
    }
  }
  return latest;
}

// @route POST /api/report/generate
const generateReport = asyncHandler(async (req, res) => {
  const user = req.user;
  const scores = await getAllScores(user._id);
  const { resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore } = scores;

  const finalScore = computeFinalScore({ resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore });
  const jobReadinessLevel = getJobReadinessLevel(finalScore);
  const { strengths, weaknesses } = deriveStrengthsWeaknesses({ resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore });

  // Gather full detail for every section of the report (not just the 5 numbers)
  const [latestResume, latestAptitude, officialCoding, latestTechInterview, latestHrInterview] = await Promise.all([
    Resume.findOne({ user: user._id }).sort({ createdAt: -1 }),
    Aptitude.findOne({ user: user._id, completed: true, mode: "full" }).sort({ createdAt: -1 }),
    getOfficialCodingSubmissions(user._id),
    Interview.findOne({ user: user._id, completed: true, mode: "technical" }).sort({ createdAt: -1 }),
    Interview.findOne({ user: user._id, completed: true, mode: "hr" }).sort({ createdAt: -1 }),
  ]);

  // ML placement prediction (best-effort - doesn't block report generation if ml_service is down)
  let mlPlacementLevel = null;
  let mlPlacementProbabilities = null;
  try {
    const cgpaNumeric = parseFloat(user.cgpa) || 0;
    const mlResult = await predictPlacement({
      resume_score: resumeScore, aptitude_score: aptitudeScore, coding_score: codingScore,
      technical_hr_score: technicalInterviewScore, general_hr_score: hrInterviewScore,
      confidence_level: user.confidenceLevel, projects_count: user.projectsCount,
      certifications: user.certificationsCount, cgpa: cgpaNumeric, internship_done: user.internshipDone ? 1 : 0,
    });
    mlPlacementLevel = mlResult.placementLevel;
    mlPlacementProbabilities = mlResult.probabilities;
  } catch (err) {
    console.warn("ML placement prediction skipped:", err.message);
  }

  // AI-generated personalized roadmap (best-effort)
  let roadmapData = null;
  try {
    roadmapData = await generateRoadmap({
      resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore,
      targetRole: user.targetRole,
    });
  } catch (err) {
    console.warn("Roadmap generation skipped:", err.message);
  }

  const pdfPath = await generateReportPDF({
    userName: user.name,
    targetRole: user.targetRole,
    resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore,
    finalScore, jobReadinessLevel, strengths, weaknesses, mlPlacementLevel, mlPlacementProbabilities,
    roadmap: roadmapData,
    resumeDetail: latestResume,
    aptitudeDetail: latestAptitude ? { ...latestAptitude.toObject(), topicBreakdown: buildTopicBreakdown(latestAptitude) } : null,
    codingDetail: officialCoding,
    technicalInterviewDetail: latestTechInterview,
    hrInterviewDetail: latestHrInterview,
  });

  const report = await Report.create({
    user: user._id,
    resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore,
    finalScore, jobReadinessLevel, strengths, weaknesses, pdfPath,
    mlPlacementLevel, mlPlacementProbabilities,
  });

  notify(user._id, {
    type: "congratulations",
    title: "Placement Report Generated",
    message: `Your overall readiness score is ${finalScore}/100 (${jobReadinessLevel}).`,
  });

  res.status(201).json({ success: true, report });
});

// @route GET /api/report/history
const getReportHistory = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, reports });
});

// @route GET /api/report/:id/download
const downloadReport = asyncHandler(async (req, res) => {
  const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  const absolutePath = path.join(__dirname, "..", report.pdfPath);
  if (!fs.existsSync(absolutePath)) {
    res.status(404);
    throw new Error("Report PDF file is missing on the server");
  }

  res.download(absolutePath, `placement-report-${report._id}.pdf`);
});

module.exports = { generateReport, getReportHistory, downloadReport };
