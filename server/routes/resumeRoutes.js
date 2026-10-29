const express = require("express");
const router = express.Router();
const { uploadResume, getResumeHistory, getLatestResume } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/history", protect, getResumeHistory);
router.get("/latest", protect, getLatestResume);

module.exports = router;
