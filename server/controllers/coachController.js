const asyncHandler = require("express-async-handler");
const CoachChat = require("../models/CoachChat");
const { callGroq } = require("../services/groqService");
const { getAllScores } = require("../services/statsService");

// @route GET /api/coach
// Gets (or creates) the user's single ongoing coach thread
const getCoachChat = asyncHandler(async (req, res) => {
  let chat = await CoachChat.findOne({ user: req.user._id });
  if (!chat) {
    chat = await CoachChat.create({
      user: req.user._id,
      messages: [{
        sender: "ai",
        text: `Hi ${req.user.name.split(" ")[0]}! I'm your AI Career Coach. Ask me anything about your resume, coding practice, interview prep, or career planning for "${req.user.targetRole}".`,
      }],
    });
  }
  res.json({ success: true, chat });
});

// @route POST /api/coach/message   { text }
const sendCoachMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    res.status(400);
    throw new Error("Message cannot be empty");
  }

  let chat = await CoachChat.findOne({ user: req.user._id });
  if (!chat) chat = await CoachChat.create({ user: req.user._id, messages: [] });

  chat.messages.push({ sender: "user", text });

  // Ground the coach's advice in the user's real progress
  const scores = await getAllScores(req.user._id);
  const systemPrompt = `You are a warm, encouraging AI career coach helping a student named ${req.user.name} prepare for placements.
Their target role is "${req.user.targetRole}". Their current scores: Resume ${scores.resumeScore}/100,
Aptitude ${scores.aptitudeScore}/100, Coding ${scores.codingScore}/100, Technical Interview ${scores.technicalInterviewScore}/100,
HR Interview ${scores.hrInterviewScore}/100.
Give concise, specific, actionable advice (3-5 sentences max per reply) about resumes, coding practice,
interview prep, or career planning. Be supportive but honest about weak areas.`;

  const history = chat.messages
    .slice(-10) // keep prompts small
    .map((m) => ({ role: m.sender === "ai" ? "assistant" : "user", content: m.text }));

  const reply = await callGroq(
    [{ role: "system", content: systemPrompt }, ...history],
    { temperature: 0.6, maxTokens: 350 }
  );

  chat.messages.push({ sender: "ai", text: reply.trim() });
  await chat.save();

  res.json({ success: true, chat });
});

module.exports = { getCoachChat, sendCoachMessage };
