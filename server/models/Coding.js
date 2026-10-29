const mongoose = require("mongoose");

const codingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: { type: String, required: true },
    questionTitle: { type: String, required: true },
    language: { type: String, default: "javascript" },
    code: { type: String, required: true },
    isOfficial: { type: Boolean, default: false }, // counts toward the mandatory Easy/Medium/Hard score
    aiEvaluation: {
      correctness: { type: Number, min: 0, max: 100, default: 0 },
      efficiency: { type: Number, min: 0, max: 100, default: 0 },
      approachQuality: { type: Number, min: 0, max: 100, default: 0 },
      score: { type: Number, min: 0, max: 100, default: 0 }, // overall
      feedback: { type: String },
      improvements: [{ type: String }],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coding", codingSchema);
