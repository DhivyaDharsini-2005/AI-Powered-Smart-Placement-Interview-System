const mongoose = require("mongoose");

const coachMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["ai", "user"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// One ongoing coach thread per user - keeps it simple instead of multiple sessions
const coachChatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    messages: [coachMessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoachChat", coachChatSchema);
