const asyncHandler = require("express-async-handler");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/resumeAI");
const { notify } = require("../services/notificationService");

// @route POST /api/resume/upload  (multipart/form-data, field name: "resume")
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No resume file uploaded. Attach a PDF under field 'resume'.");
  }

  const targetRole = req.body.targetRole || req.user.targetRole || "Software Development Engineer";

  // Extract raw text from the uploaded PDF
  const dataBuffer = fs.readFileSync(req.file.path);
  const pdfData = await pdfParse(dataBuffer);
  const extractedText = pdfData.text?.trim();

  if (!extractedText || extractedText.length < 30) {
    res.status(400);
    throw new Error(
      "Could not extract readable text from this PDF. Make sure it's a text-based PDF, not a scanned image."
    );
  }

  // Run AI ATS analysis via Groq
  const analysis = await analyzeResume(extractedText, targetRole);

  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.originalname,
    targetRole,
    extractedText,
    atsScore: analysis.atsScore,
    missingKeywords: analysis.missingKeywords,
    suggestions: analysis.suggestions,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
  });

  notify(req.user._id, {
    type: "resume_score",
    title: "Resume Analyzed",
    message: `Your resume scored ${analysis.atsScore}/100 for "${targetRole}". Check the suggestions to improve it further.`,
  });

  res.status(201).json({ success: true, resume });
});

// @route GET /api/resume/history
const getResumeHistory = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-extractedText");
  res.json({ success: true, resumes });
});

// @route GET /api/resume/latest
const getLatestResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, resume });
});

module.exports = { uploadResume, getResumeHistory, getLatestResume };
