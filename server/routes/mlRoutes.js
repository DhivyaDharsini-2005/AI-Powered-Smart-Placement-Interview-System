const express = require("express");
const router = express.Router();
const { getPlacementPrediction, getResumeQualityPrediction } = require("../controllers/mlController");
const { protect } = require("../middleware/authMiddleware");

router.get("/placement-prediction", protect, getPlacementPrediction);
router.post("/resume-quality", protect, getResumeQualityPrediction);

module.exports = router;
