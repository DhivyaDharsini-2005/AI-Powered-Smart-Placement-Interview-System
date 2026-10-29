const { callGroq } = require("./groqService");

// Four lightweight Groq-powered helpers for the coding editor toolbar.
// These are plain-text responses (not JSON), shown directly in a side panel.

async function getHint({ questionTitle, questionDescription, code }) {
  const system = `You are a coding mentor. Give a SHORT hint (2-4 sentences) that nudges the
student toward the right approach WITHOUT revealing the full solution or writing code for them.`;
  const user = `Question: ${questionTitle}\n${questionDescription}\n\nStudent's current code:\n${code || "(empty)"}\n\nGive a hint.`;
  return callGroq([{ role: "system", content: system }, { role: "user", content: user }], { temperature: 0.5, maxTokens: 200 });
}

async function explainSolution({ questionTitle, questionDescription, code }) {
  const system = `You are a coding mentor. Explain the approach and logic of the given code clearly,
step by step, in plain English (not just restating the code). Keep it under 200 words.`;
  const user = `Question: ${questionTitle}\n${questionDescription}\n\nCode:\n${code}\n\nExplain this solution.`;
  return callGroq([{ role: "system", content: system }, { role: "user", content: user }], { temperature: 0.4, maxTokens: 400 });
}

async function optimizeCode({ questionTitle, language, code }) {
  const system = `You are a senior engineer. Suggest concrete optimizations (time/space complexity,
cleaner patterns) for the given ${language} code. If it's already optimal, say so and explain why.
Keep it under 200 words, use bullet points.`;
  const user = `Question: ${questionTitle}\n\nCode:\n${code}\n\nSuggest optimizations.`;
  return callGroq([{ role: "system", content: system }, { role: "user", content: user }], { temperature: 0.4, maxTokens: 400 });
}

async function detectBugs({ questionTitle, questionDescription, language, code }) {
  const system = `You are a code reviewer. Carefully check the given ${language} code for bugs,
edge cases it misses, and logic errors relative to the problem statement. If you find none, say so.
Keep it under 200 words, use bullet points.`;
  const user = `Question: ${questionTitle}\n${questionDescription}\n\nCode:\n${code}\n\nFind bugs or edge cases.`;
  return callGroq([{ role: "system", content: system }, { role: "user", content: user }], { temperature: 0.3, maxTokens: 400 });
}

module.exports = { getHint, explainSolution, optimizeCode, detectBugs };
