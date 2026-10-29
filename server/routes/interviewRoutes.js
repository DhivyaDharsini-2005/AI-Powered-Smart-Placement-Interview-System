const express = require("express");
const router = express.Router();
const {
  startInterview,
  sendMessage,
  endInterview,
  logProctoringEvent,
  getHistory,
  getInterviewById,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/start", protect, startInterview);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getInterviewById);
router.post("/:id/message", protect, sendMessage);
router.post("/:id/end", protect, endInterview);
router.post("/:id/proctor", protect, logProctoringEvent);

module.exports = router;
