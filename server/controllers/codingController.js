const asyncHandler = require("express-async-handler");
const Coding = require("../models/Coding");
const CodingAssignment = require("../models/CodingAssignment");
const { questions } = require("../data/codingQuestions");
const { evaluateCodeSubmission } = require("../services/interviewAI");
const { runTestCases } = require("../services/judge0Service");
const { getHint, explainSolution, optimizeCode, detectBugs } = require("../services/codeAssistAI");
const { notify } = require("../services/notificationService");

function findQuestion(id) {
  const q = questions.find((q) => q.id === id);
  if (!q) throw new Error("Question not found");
  return q;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Gets (or creates) the user's mandatory Easy/Medium/Hard assignment.
// Prefers execution-supported questions per difficulty so the official score
// is backed by real test-case results, not just AI opinion.
async function getOrCreateAssignment(userId) {
  let assignment = await CodingAssignment.findOne({ user: userId });
  if (assignment) return assignment;

  const pick = (difficulty) => {
    const pool = questions.filter((q) => q.difficulty === difficulty);
    const executable = pool.filter((q) => q.supportsExecution);
    return randomFrom(executable.length ? executable : pool);
  };

  assignment = await CodingAssignment.create({
    user: userId,
    easyQuestionId: pick("Easy").id,
    mediumQuestionId: pick("Medium").id,
    hardQuestionId: pick("Hard").id,
  });
  return assignment;
}

// @route GET /api/coding/assignment
// Returns the user's mandatory 3 questions + completion status for each.
const getAssignment = asyncHandler(async (req, res) => {
  const assignment = await getOrCreateAssignment(req.user._id);
  const ids = [assignment.easyQuestionId, assignment.mediumQuestionId, assignment.hardQuestionId];

  const officialSubs = await Coding.find({ user: req.user._id, isOfficial: true, questionId: { $in: ids } })
    .sort({ createdAt: -1 });

  const buildEntry = (difficulty, questionId) => {
    const question = findQuestion(questionId);
    const sub = officialSubs.find((s) => s.questionId === questionId);
    const { testCases, ...safeQuestion } = question;
    safeQuestion.sampleTestCases = (testCases || []).filter((tc) => !tc.hidden);
    return { difficulty, question: safeQuestion, completed: !!sub, score: sub?.aiEvaluation?.score ?? null };
  };

  const mandatory = [
    buildEntry("Easy", assignment.easyQuestionId),
    buildEntry("Medium", assignment.mediumQuestionId),
    buildEntry("Hard", assignment.hardQuestionId),
  ];

  const allMandatoryComplete = mandatory.every((m) => m.completed);

  res.json({ success: true, mandatory, allMandatoryComplete });
});

// @route GET /api/coding/questions  (practice pool - shown only after mandatory 3 are done)
const getQuestions = asyncHandler(async (req, res) => {
  const safe = questions.map(({ testCases, ...rest }) => rest);
  res.json({ success: true, questions: safe });
});

// @route GET /api/coding/questions/:id
const getQuestionById = asyncHandler(async (req, res) => {
  const question = findQuestion(req.params.id);
  const { testCases, ...safe } = question;
  safe.sampleTestCases = (testCases || []).filter((tc) => !tc.hidden);
  res.json({ success: true, question: safe });
});

// @route POST /api/coding/run   { questionId, language, code }
const runCode = asyncHandler(async (req, res) => {
  const { questionId, language, code } = req.body;
  const question = findQuestion(questionId);

  if (!question.supportsExecution) {
    res.status(400);
    throw new Error("This question doesn't support live execution yet - try 'Submit for AI Review' instead.");
  }
  if (!code || code.trim().length < 5) {
    res.status(400);
    throw new Error("Please write some code first");
  }

  const visibleCases = question.testCases.filter((tc) => !tc.hidden);
  const results = await runTestCases({ language, code, testCases: visibleCases });
  res.json({ success: true, results });
});

// @route POST /api/coding/submit   { questionId, language, code }
// Automatically flags the submission as "official" if it matches one of the
// user's assigned mandatory Easy/Medium/Hard questions - everything else
// (including resubmissions of an already-completed mandatory question, and
// anything done via "Practice More") is practice and doesn't affect the score.
const submitCode = asyncHandler(async (req, res) => {
  const { questionId, language, code } = req.body;
  const question = findQuestion(questionId);

  if (!code || code.trim().length < 5) {
    res.status(400);
    throw new Error("Please submit some code before evaluating");
  }

  const assignment = await getOrCreateAssignment(req.user._id);
  const officialIds = [assignment.easyQuestionId, assignment.mediumQuestionId, assignment.hardQuestionId];
  const isOfficial = officialIds.includes(questionId);

  let executionResults = null;
  let allPassed = null;

  if (question.supportsExecution) {
    executionResults = await runTestCases({ language, code, testCases: question.testCases });
    allPassed = executionResults.every((r) => r.passed);
  }

  const aiEvaluation = await evaluateCodeSubmission({
    questionTitle: question.title,
    questionDescription: question.description,
    language: language || "javascript",
    code,
  });

  if (allPassed !== null) {
    aiEvaluation.correctness = allPassed ? 100 : Math.round((executionResults.filter((r) => r.passed).length / executionResults.length) * 100);
    aiEvaluation.score = Math.round(aiEvaluation.correctness * 0.5 + aiEvaluation.efficiency * 0.25 + aiEvaluation.approachQuality * 0.25);
  }

  const record = await Coding.create({
    user: req.user._id,
    questionId: question.id,
    questionTitle: question.title,
    language: language || "javascript",
    code,
    isOfficial,
    aiEvaluation,
  });

  notify(req.user._id, {
    type: "coding_progress",
    title: isOfficial ? "Mandatory Coding Problem Solved" : "Practice Submission Reviewed",
    message: `"${question.title}" scored ${aiEvaluation.score}/100${allPassed !== null ? (allPassed ? " - all test cases passed! 🎉" : "") : ""}.`,
  });

  res.status(201).json({ success: true, record, executionResults, isOfficial });
});

const hint = asyncHandler(async (req, res) => {
  const question = findQuestion(req.body.questionId);
  const text = await getHint({ questionTitle: question.title, questionDescription: question.description, code: req.body.code });
  res.json({ success: true, text });
});

const explain = asyncHandler(async (req, res) => {
  const question = findQuestion(req.body.questionId);
  const text = await explainSolution({ questionTitle: question.title, questionDescription: question.description, code: req.body.code });
  res.json({ success: true, text });
});

const optimize = asyncHandler(async (req, res) => {
  const question = findQuestion(req.body.questionId);
  const text = await optimizeCode({ questionTitle: question.title, language: req.body.language, code: req.body.code });
  res.json({ success: true, text });
});

const detectBugsRoute = asyncHandler(async (req, res) => {
  const question = findQuestion(req.body.questionId);
  const text = await detectBugs({ questionTitle: question.title, questionDescription: question.description, language: req.body.language, code: req.body.code });
  res.json({ success: true, text });
});

// @route GET /api/coding/history
const getHistory = asyncHandler(async (req, res) => {
  const records = await Coding.find({ user: req.user._id }).sort({ createdAt: -1 }).select("-code");
  res.json({ success: true, records });
});

module.exports = {
  getAssignment, getQuestions, getQuestionById, runCode, submitCode, getHistory,
  hint, explain, optimize, detectBugsRoute,
};
