const express = require("express");
const router = express.Router();
const { getCoachChat, sendCoachMessage } = require("../controllers/coachController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCoachChat);
router.post("/message", protect, sendCoachMessage);

module.exports = router;
