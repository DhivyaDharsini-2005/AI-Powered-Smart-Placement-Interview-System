const asyncHandler = require("express-async-handler");
const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const {
  generateNextQuestion,
  evaluateFinalInterview,
} = require("../services/interviewAI");

// @route POST /api/interview/start   { mode: "technical"|"hr", role }
const startInterview = asyncHandler(async (req, res) => {
  const { mode, role } = req.body;

  if (!["technical", "hr"].includes(mode)) {
    res.status(400);
    throw new Error("mode must be 'technical' or 'hr'");
  }

  const targetRole = role || req.user.targetRole || "Software Development Engineer";

  // Pull the candidate's latest resume text (if any) to ground technical questions
  let resumeContext = null;
  if (mode === "technical") {
    const latestResume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (latestResume) {
      resumeContext = latestResume.extractedText?.slice(0, 1500);
    }
  }

  const firstQuestion = await generateNextQuestion({
    mode,
    role: targetRole,
    resumeContext,
    history: [],
  });

  const interview = await Interview.create({
    user: req.user._id,
    mode,
    role: targetRole,
    messages: [{ sender: "ai", text: firstQuestion }],
  });

  res.status(201).json({ success: true, interview });
});

// @route POST /api/interview/:id/message   { text }
const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

  if (!interview) {
    res.status(404);
    throw new Error("Interview session not found");
  }
  if (interview.completed) {
    res.status(400);
    throw new Error("This interview has already ended");
  }
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Answer text cannot be empty");
  }

  interview.messages.push({ sender: "user", text });

  let resumeContext = null;
  if (interview.mode === "technical") {
    const latestResume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (latestResume) resumeContext = latestResume.extractedText?.slice(0, 1500);
  }

  const nextQuestion = await generateNextQuestion({
    mode: interview.mode,
    role: interview.role,
    resumeContext,
    history: interview.messages,
  });

  interview.messages.push({ sender: "ai", text: nextQuestion });
  await interview.save();

  res.json({ success: true, interview });
});

// @route POST /api/interview/:id/end   (optional body: { engagementSummary })
const endInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

  if (!interview) {
    res.status(404);
    throw new Error("Interview session not found");
  }
  if (interview.completed) {
    return res.json({ success: true, interview }); // already ended, just return it
  }

  const evaluation = await evaluateFinalInterview({
    mode: interview.mode,
    role: interview.role,
    history: interview.messages,
  });

  interview.evaluation = evaluation;
  interview.completed = true;
  if (req.body?.engagementSummary) {
    interview.engagementSummary = {
      avgBlinkRate: req.body.engagementSummary.blinkRate ?? null,
      gazeAwayPercent: req.body.engagementSummary.gazeAwayPercent ?? null,
    };
  }
  await interview.save();

  res.json({ success: true, interview });
});

// @route POST /api/interview/:id/proctor   { type }
const logProctoringEvent = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const validTypes = ["tab_switch", "no_face_detected", "multiple_faces", "webcam_off"];

  if (!validTypes.includes(type)) {
    res.status(400);
    throw new Error("Invalid proctoring event type");
  }

  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error("Interview session not found");
  }

  interview.proctoringFlags.push({ type });
  await interview.save();

  res.json({ success: true, flagCount: interview.proctoringFlags.length });
});

// @route GET /api/interview/history
const getHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-messages");
  res.json({ success: true, interviews });
});

// @route GET /api/interview/:id
const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error("Interview session not found");
  }
  res.json({ success: true, interview });
});

module.exports = {
  startInterview,
  sendMessage,
  endInterview,
  logProctoringEvent,
  getHistory,
  getInterviewById,
};
