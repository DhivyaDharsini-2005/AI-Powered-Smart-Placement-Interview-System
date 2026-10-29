const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeScore: { type: Number, default: 0 },
    aptitudeScore: { type: Number, default: 0 },
    codingScore: { type: Number, default: 0 },
    technicalInterviewScore: { type: Number, default: 0 },
    hrInterviewScore: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    mlPlacementLevel: { type: String, default: null }, // "High" | "Medium" | "Low", from the trained ML model
    mlPlacementProbabilities: { type: Object, default: null },
    jobReadinessLevel: {
      type: String,
      enum: ["Not Ready", "Needs Improvement", "Ready", "Highly Ready"],
      default: "Needs Improvement",
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    pdfPath: { type: String }, // relative path under /reports
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
