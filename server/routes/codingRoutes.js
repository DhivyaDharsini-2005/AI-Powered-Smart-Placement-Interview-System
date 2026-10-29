const express = require("express");
const router = express.Router();
const {
  getAssignment, getQuestions, getQuestionById, runCode, submitCode, getHistory,
  hint, explain, optimize, detectBugsRoute,
} = require("../controllers/codingController");
const { protect } = require("../middleware/authMiddleware");

router.get("/assignment", protect, getAssignment);
router.get("/questions", protect, getQuestions);
router.get("/history", protect, getHistory);
router.get("/questions/:id", protect, getQuestionById);
router.post("/run", protect, runCode);
router.post("/submit", protect, submitCode);
router.post("/hint", protect, hint);
router.post("/explain", protect, explain);
router.post("/optimize", protect, optimize);
router.post("/detect-bugs", protect, detectBugsRoute);

module.exports = router;
