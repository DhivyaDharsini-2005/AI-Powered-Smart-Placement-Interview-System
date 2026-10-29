const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: { type: String, required: true },
    targetRole: { type: String, required: true },
    extractedText: { type: String }, // raw text pulled from the PDF
    atsScore: { type: Number, min: 0, max: 100, default: 0 },
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
