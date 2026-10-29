const mongoose = require("mongoose");

// Each question is stored in full (including the correct answer + explanation)
// on the server-side document. The API layer strips correctIndex/explanation
// out before sending questions to the client, only revealing them after submit.
const questionSchema = new mongoose.Schema(
  {
    questionId: String,
    questionText: String,
    options: [String],
    correctIndex: Number,
    explanation: String,
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    category: String,
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema(
  {
    selectedIndex: { type: Number, default: null },
    flaggedForReview: { type: Boolean, default: false },
  },
  { _id: false }
);

const aiFeedbackSchema = new mongoose.Schema(
  {
    feedback: String,
    strengths: [String],
    weakAreas: [String],
    nextSteps: [String],
  },
  { _id: false }
);

const aptitudeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, default: "Mixed - All Topics" },
    mode: { type: String, enum: ["full", "topic"], default: "full" },
    questions: [questionSchema],
    responses: [responseSchema], // parallel array - responses[i] belongs to questions[i]
    totalQuestions: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    score: { type: Number, min: 0, max: 100, default: 0 }, // percentage
    aiFeedback: aiFeedbackSchema,
    startedAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Aptitude", aptitudeSchema);
