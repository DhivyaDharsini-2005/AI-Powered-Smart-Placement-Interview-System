const mongoose = require("mongoose");

// One per user - the randomly-assigned mandatory Easy/Medium/Hard question IDs
// that count toward the official Coding Score. Created once on first visit.
const codingAssignmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    easyQuestionId: { type: String, required: true },
    mediumQuestionId: { type: String, required: true },
    hardQuestionId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodingAssignment", codingAssignmentSchema);
