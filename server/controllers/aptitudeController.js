const asyncHandler = require("express-async-handler");
const Aptitude = require("../models/Aptitude");
const {
  bank, CATEGORIES, TOTAL_QUESTIONS_PER_SESSION, TOPIC_PRACTICE_QUESTIONS,
  TEST_DURATION_SECONDS, TOPIC_TEST_DURATION_SECONDS,
} = require("../data/aptitudeQuestions");
const { generateAptitudeFeedback } = require("../services/aptitudeAI");
const { notify } = require("../services/notificationService");

function sanitizeQuestion(q, index) {
  return { index, questionText: q.questionText, options: q.options, difficulty: q.difficulty, category: q.category };
}

function sanitizeSession(doc) {
  const duration = doc.mode === "topic" ? TOPIC_TEST_DURATION_SECONDS : TEST_DURATION_SECONDS;
  const elapsed = Math.floor((Date.now() - new Date(doc.startedAt).getTime()) / 1000);
  return {
    _id: doc._id,
    category: doc.category,
    mode: doc.mode,
    totalQuestions: doc.totalQuestions,
    completed: doc.completed,
    durationSeconds: duration,
    secondsRemaining: Math.max(0, duration - elapsed),
    questions: doc.questions.map((q, i) => sanitizeQuestion(q, i)),
    responses: doc.responses.map((r) => ({ selectedIndex: r.selectedIndex, flaggedForReview: r.flaggedForReview })),
  };
}

function buildFullPool() {
  const pool = [];
  for (const category of CATEGORIES) {
    for (const difficulty of ["easy", "medium", "hard"]) {
      for (const q of bank[category][difficulty]) pool.push({ ...q, difficulty, category });
    }
  }
  return pool;
}

const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));

// Mixed-difficulty draw across ALL 15 categories - used for the Full Aptitude Test
function buildMixedQuestionSet(count) {
  const fullPool = buildFullPool();
  const byDifficulty = {
    easy: fullPool.filter((q) => q.difficulty === "easy"),
    medium: fullPool.filter((q) => q.difficulty === "medium"),
    hard: fullPool.filter((q) => q.difficulty === "hard"),
  };
  const easyCount = Math.round(count * 0.3);
  const mediumCount = Math.round(count * 0.4);
  const hardCount = count - easyCount - mediumCount;
  const selected = [...pickN(byDifficulty.easy, easyCount), ...pickN(byDifficulty.medium, mediumCount), ...pickN(byDifficulty.hard, hardCount)];
  return selected.sort(() => Math.random() - 0.5);
}

// All 20 questions of a single category (mixed difficulty within that topic) - used for Topic Practice
function buildTopicQuestionSet(category) {
  const pool = bank[category];
  if (!pool) return null;
  const all = [
    ...pool.easy.map((q) => ({ ...q, difficulty: "easy", category })),
    ...pool.medium.map((q) => ({ ...q, difficulty: "medium", category })),
    ...pool.hard.map((q) => ({ ...q, difficulty: "hard", category })),
  ];
  return all.sort(() => Math.random() - 0.5);
}

// @route GET /api/aptitude/categories
const getCategories = asyncHandler(async (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
});

// @route POST /api/aptitude/start   body: { mode: 'full' | 'topic', category? }
const startTest = asyncHandler(async (req, res) => {
  const { mode = "full", category } = req.body;

  let selected, sessionCategory;

  if (mode === "topic") {
    if (!CATEGORIES.includes(category)) {
      res.status(400);
      throw new Error(`Invalid category. Choose one of: ${CATEGORIES.join(", ")}`);
    }
    selected = buildTopicQuestionSet(category);
    sessionCategory = category;
  } else {
    selected = buildMixedQuestionSet(TOTAL_QUESTIONS_PER_SESSION);
    sessionCategory = "Mixed - All Topics";
  }

  if (!selected || selected.length === 0) {
    res.status(500);
    throw new Error("Not enough questions in the bank to build this assessment.");
  }

  const aptitude = await Aptitude.create({
    user: req.user._id,
    category: sessionCategory,
    mode: mode === "topic" ? "topic" : "full",
    questions: selected.map((q) => ({
      questionId: q.id, questionText: q.questionText, options: q.options,
      correctIndex: q.correctIndex, explanation: q.explanation, difficulty: q.difficulty, category: q.category,
    })),
    responses: selected.map(() => ({ selectedIndex: null, flaggedForReview: false })),
    totalQuestions: selected.length,
    startedAt: new Date(),
  });

  res.status(201).json({ success: true, session: sanitizeSession(aptitude) });
});

// @route GET /api/aptitude/:id
const getSession = asyncHandler(async (req, res) => {
  const aptitude = await Aptitude.findOne({ _id: req.params.id, user: req.user._id });
  if (!aptitude) {
    res.status(404);
    throw new Error("Test session not found");
  }
  res.json({ success: true, session: sanitizeSession(aptitude) });
});

// @route PATCH /api/aptitude/:id/answer   { index, selectedIndex }  - auto-save
const answerQuestion = asyncHandler(async (req, res) => {
  const { index, selectedIndex } = req.body;
  const aptitude = await Aptitude.findOne({ _id: req.params.id, user: req.user._id });

  if (!aptitude) {
    res.status(404);
    throw new Error("Test session not found");
  }
  if (aptitude.completed) {
    res.status(400);
    throw new Error("This test has already been submitted");
  }
  if (index < 0 || index >= aptitude.responses.length) {
    res.status(400);
    throw new Error("Invalid question index");
  }

  aptitude.responses[index].selectedIndex = selectedIndex;
  await aptitude.save();

  res.json({ success: true, session: sanitizeSession(aptitude) });
});

// @route PATCH /api/aptitude/:id/flag   { index, flagged }
const flagQuestion = asyncHandler(async (req, res) => {
  const { index, flagged } = req.body;
  const aptitude = await Aptitude.findOne({ _id: req.params.id, user: req.user._id });

  if (!aptitude) {
    res.status(404);
    throw new Error("Test session not found");
  }
  if (index < 0 || index >= aptitude.responses.length) {
    res.status(400);
    throw new Error("Invalid question index");
  }

  aptitude.responses[index].flaggedForReview = flagged;
  await aptitude.save();

  res.json({ success: true, session: sanitizeSession(aptitude) });
});

// @route POST /api/aptitude/:id/submit   (works for both manual and auto-submit-on-timeout)
const submitTest = asyncHandler(async (req, res) => {
  const aptitude = await Aptitude.findOne({ _id: req.params.id, user: req.user._id });

  if (!aptitude) {
    res.status(404);
    throw new Error("Test session not found");
  }
  if (aptitude.completed) {
    return res.json({ success: true, result: buildResult(aptitude) });
  }

  let correctCount = 0;
  aptitude.questions.forEach((q, i) => {
    if (aptitude.responses[i].selectedIndex === q.correctIndex) correctCount++;
  });

  aptitude.correctCount = correctCount;
  aptitude.score = Math.round((correctCount / aptitude.totalQuestions) * 100);
  aptitude.completed = true;

  const topicBreakdown = buildTopicBreakdown(aptitude);

  // AI feedback is a nice-to-have - never let it block the submission itself
  try {
    aptitude.aiFeedback = await generateAptitudeFeedback({
      score: aptitude.score,
      totalQuestions: aptitude.totalQuestions,
      correctCount,
      topicBreakdown,
      isFullTest: aptitude.mode === "full",
    });
  } catch (err) {
    console.warn("Aptitude AI feedback generation skipped:", err.message);
  }

  await aptitude.save();

  notify(req.user._id, {
    type: "coding_progress",
    title: aptitude.mode === "full" ? "Full Aptitude Test Completed" : `${aptitude.category} Practice Completed`,
    message: `You scored ${aptitude.score}% (${correctCount}/${aptitude.totalQuestions} correct).`,
  });

  res.json({ success: true, result: buildResult(aptitude) });
});

function buildTopicBreakdown(aptitude) {
  const topicMap = {};
  aptitude.questions.forEach((q, i) => {
    const isCorrect = aptitude.responses[i].selectedIndex === q.correctIndex;
    if (!topicMap[q.category]) topicMap[q.category] = { attempted: 0, correct: 0 };
    topicMap[q.category].attempted += 1;
    if (isCorrect) topicMap[q.category].correct += 1;
  });
  return Object.entries(topicMap).map(([topic, stats]) => ({ topic, ...stats }));
}

function buildResult(aptitude) {
  return {
    _id: aptitude._id,
    category: aptitude.category,
    mode: aptitude.mode,
    score: aptitude.score,
    correctCount: aptitude.correctCount,
    totalQuestions: aptitude.totalQuestions,
    accuracy: aptitude.score, // same metric here (% correct of attempted-as-total)
    topicBreakdown: buildTopicBreakdown(aptitude),
    aiFeedback: aptitude.aiFeedback || null,
    review: aptitude.questions.map((q, i) => ({
      questionText: q.questionText, options: q.options, correctIndex: q.correctIndex,
      explanation: q.explanation, difficulty: q.difficulty, category: q.category,
      selectedIndex: aptitude.responses[i].selectedIndex,
      isCorrect: aptitude.responses[i].selectedIndex === q.correctIndex,
      flaggedForReview: aptitude.responses[i].flaggedForReview,
    })),
  };
}

// @route GET /api/aptitude/history
const getHistory = asyncHandler(async (req, res) => {
  const records = await Aptitude.find({ user: req.user._id, completed: true })
    .sort({ createdAt: -1 })
    .select("category mode score correctCount totalQuestions createdAt");
  res.json({ success: true, records });
});

// @route GET /api/aptitude/topic-best   - best score per topic, for the practice card grid
const getTopicBest = asyncHandler(async (req, res) => {
  const records = await Aptitude.find({ user: req.user._id, completed: true, mode: "topic" });
  const bestByTopic = {};
  for (const r of records) {
    if (!bestByTopic[r.category] || r.score > bestByTopic[r.category].score) {
      bestByTopic[r.category] = { score: r.score, attempts: 0 };
    }
  }
  for (const r of records) {
    if (!bestByTopic[r.category]) bestByTopic[r.category] = { score: 0, attempts: 0 };
    bestByTopic[r.category].attempts += 1;
  }
  res.json({ success: true, bestByTopic });
});

module.exports = {
  getCategories, startTest, getSession, answerQuestion, flagQuestion, submitTest, getHistory, getTopicBest,
};
