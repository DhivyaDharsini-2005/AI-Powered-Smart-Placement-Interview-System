const { callGroq, safeParseJSON } = require("./groqService");

/**
 * Generates a short personalized improvement roadmap for the final PDF
 * report, based on the candidate's actual scores across all modules.
 */
async function generateRoadmap({ resumeScore, aptitudeScore, codingScore, technicalInterviewScore, hrInterviewScore, targetRole }) {
  const systemPrompt = `You are a placement preparation mentor. Respond with ONLY valid JSON, no markdown fences, in exactly this shape:
{
  "summary": "<2-3 sentence overall assessment>",
  "roadmap": [<string>, <string>, <string>, <string>]
}
The roadmap should be 4 concrete, prioritized next steps, ordered by impact (most important first).`;

  const userPrompt = `Candidate targeting role: "${targetRole}".
Scores: Resume ${resumeScore}/100, Aptitude ${aptitudeScore}/100, Coding ${codingScore}/100, Technical Interview ${technicalInterviewScore}/100, HR Interview ${hrInterviewScore}/100.

Give a brief overall summary and a 4-step prioritized roadmap for improving placement readiness.`;

  const raw = await callGroq(
    [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    { temperature: 0.5, maxTokens: 500 }
  );

  return safeParseJSON(raw, {
    summary: "Keep practicing consistently across all modules to improve your placement readiness.",
    roadmap: [
      "Complete all assessment modules to get a full picture of your readiness.",
      "Focus extra practice time on your lowest-scoring area.",
      "Revisit AI feedback from each module and act on the specific suggestions given.",
      "Retake assessments periodically to track improvement over time.",
    ],
  });
}

module.exports = { generateRoadmap };
