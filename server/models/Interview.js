const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["ai", "user"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const proctorFlagSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["tab_switch", "no_face_detected", "multiple_faces", "webcam_off"],
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mode: { type: String, enum: ["technical", "hr"], required: true },
    role: { type: String, required: true },
    messages: [messageSchema],
    proctoringFlags: [proctorFlagSchema],
    engagementSummary: {
      avgBlinkRate: { type: Number, default: null },
      gazeAwayPercent: { type: Number, default: null },
    },
    evaluation: {
      score: { type: Number, min: 0, max: 100, default: 0 },
      feedback: { type: String },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      improvements: [{ type: String }],
    },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
