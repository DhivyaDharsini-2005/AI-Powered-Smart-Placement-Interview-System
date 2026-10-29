const express = require("express");
const router = express.Router();
const {
  generateReport,
  getReportHistory,
  downloadReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateReport);
router.get("/history", protect, getReportHistory);
router.get("/:id/download", protect, downloadReport);

module.exports = router;
