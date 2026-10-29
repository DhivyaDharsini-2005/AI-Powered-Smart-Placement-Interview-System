const { callGroq, safeParseJSON } = require("./groqService");

/**
 * Generates the next interview question based on mode (technical/hr),
 * target role, and the conversation so far. Keeps the AI "in character"
 * as a strict interviewer across turns.
 */
async function generateNextQuestion({ mode, role, resumeContext, history }) {
  const systemPrompt =
    mode === "technical"
      ? `You are a strict senior technical interviewer conducting a real interview for the role of "${role}".
Ask one question at a time - either a role-specific technical question, a DSA/system-design question, or a question based on the candidate's resume.
Keep questions concise (1-3 sentences). Do not repeat earlier questions. Do not give the answer away.
Respond with ONLY the question text, no preamble, no numbering, no JSON.`
      : `You are a strict HR interviewer conducting a behavioral interview for the role of "${role}".
Ask one behavioral/situational question at a time (e.g. teamwork, conflict, leadership, motivation).
Keep questions concise (1-3 sentences). Do not repeat earlier questions.
Respond with ONLY the question text, no preamble, no numbering, no JSON.`;

  const historyText = history
    .map((m) => `${m.sender === "ai" ? "Interviewer" : "Candidate"}: ${m.text}`)
    .join("\n");

  const userPrompt = `${resumeContext ? `Candidate resume summary:\n${resumeContext}\n\n` : ""}Conversation so far:
${historyText || "(This is the first question - start the interview.)"}

Ask the next interview question now.`;

  const question = await callGroq(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.6, maxTokens: 200 }
  );

  return question.trim();
}

/**
 * Once the interview ends, this sends the full transcript to Groq and asks
 * for a structured, scored evaluation - acting like a strict interviewer
 * filling out a feedback form.
 */
async function evaluateFinalInterview({ mode, role, history }) {
  const systemPrompt = `You are a strict ${mode === "technical" ? "technical" : "HR"} interviewer for the role "${role}".
You just finished interviewing a candidate. Evaluate their FULL performance across the whole conversation.
Respond with ONLY valid JSON in exactly this shape, no markdown fences:

{
  "score": <number 0-100>,
  "feedback": "<2-4 sentence overall summary>",
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "improvements": [<string>, ...]
}`;

  const transcript = history
    .map((m) => `${m.sender === "ai" ? "Interviewer" : "Candidate"}: ${m.text}`)
    .join("\n");

  const raw = await callGroq(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Full interview transcript:\n\n${transcript}` },
    ],
    { temperature: 0.3, maxTokens: 800 }
  );

  return safeParseJSON(raw, {
    score: 50,
    feedback: "Could not generate AI evaluation. Please try again.",
    strengths: [],
    weaknesses: [],
    improvements: [],
  });
}

/**
 * Evaluates a coding submission for correctness, efficiency and approach
 * quality, purely through AI code review (no sandboxed execution).
 */
async function evaluateCodeSubmission({ questionTitle, questionDescription, language, code }) {
  const systemPrompt = `You are a strict technical interviewer reviewing a candidate's code submission.
Evaluate it like a senior engineer doing a code review for a DSA/coding round.
Respond with ONLY valid JSON in exactly this shape, no markdown fences:

{
  "correctness": <number 0-100>,
  "efficiency": <number 0-100>,
  "approachQuality": <number 0-100>,
  "score": <number 0-100 (overall, weighted average)>,
  "feedback": "<2-4 sentence summary>",
  "improvements": [<string>, ...]
}`;

  const userPrompt = `Question: ${questionTitle}
Description: ${questionDescription}
Language: ${language}

Candidate's code:
\`\`\`${language}
${code}
\`\`\`

Evaluate correctness (does the logic solve the problem?), time/space efficiency, and overall approach quality.`;

  const raw = await callGroq(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.2, maxTokens: 700 }
  );

  return safeParseJSON(raw, {
    correctness: 50,
    efficiency: 50,
    approachQuality: 50,
    score: 50,
    feedback: "Could not generate AI evaluation. Please try again.",
    improvements: [],
  });
}

module.exports = {
  generateNextQuestion,
  evaluateFinalInterview,
  evaluateCodeSubmission,
};
