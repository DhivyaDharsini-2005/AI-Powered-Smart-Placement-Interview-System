const { callGroq, safeParseJSON } = require("./groqService");

/**
 * Generates a short, personalized feedback paragraph after an aptitude
 * test/practice session, based on the score and topic-wise breakdown.
 */
async function generateAptitudeFeedback({ score, totalQuestions, correctCount, topicBreakdown, isFullTest }) {
  const breakdownText = topicBreakdown
    .map((t) => `${t.topic}: ${t.correct}/${t.attempted} correct`)
    .join("; ");

  const systemPrompt = `You are an encouraging but honest aptitude test mentor. Respond with ONLY valid JSON, no markdown fences, in exactly this shape:
{
  "feedback": "<3-4 sentence personalized summary of performance>",
  "strengths": [<string>, ...],
  "weakAreas": [<string>, ...],
  "nextSteps": [<string>, ...]
}`;

  const userPrompt = `A candidate just completed a${isFullTest ? " full mixed-topic" : " topic-specific"} aptitude assessment.
Score: ${score}% (${correctCount}/${totalQuestions} correct).
Topic-wise breakdown: ${breakdownText || "N/A"}.

Give a short personalized summary, list 1-3 strengths (topics done well), 1-3 weak areas (topics needing work), and 2-3 concrete next steps for improvement.`;

  const raw = await callGroq(
    [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    { temperature: 0.5, maxTokens: 500 }
  );

  return safeParseJSON(raw, {
    feedback: `You scored ${score}% on this assessment.`,
    strengths: [],
    weakAreas: [],
    nextSteps: [],
  });
}

module.exports = { generateAptitudeFeedback };
