const express = require("express");
const router = express.Router();
const {
  getCategories, startTest, getSession, answerQuestion, flagQuestion, submitTest, getHistory, getTopicBest,
} = require("../controllers/aptitudeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/categories", protect, getCategories);
router.get("/history", protect, getHistory);
router.get("/topic-best", protect, getTopicBest);
router.post("/start", protect, startTest);
router.get("/:id", protect, getSession);
router.patch("/:id/answer", protect, answerQuestion);
router.patch("/:id/flag", protect, flagQuestion);
router.post("/:id/submit", protect, submitTest);

module.exports = router;
