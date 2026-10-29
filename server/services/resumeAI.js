const { callGroq, safeParseJSON } = require("./groqService");

/**
 * Sends extracted resume text to Groq AI and asks it to act as a strict
 * ATS (Applicant Tracking System) + technical recruiter, returning a
 * structured JSON evaluation.
 */
async function analyzeResume(resumeText, targetRole) {
  const systemPrompt = `You are a strict, experienced ATS (Applicant Tracking System) and senior technical recruiter.
You evaluate resumes for the role of "${targetRole}".
You MUST respond with ONLY valid JSON, no preamble, no markdown fences, matching this exact shape:

{
  "atsScore": <number 0-100>,
  "missingKeywords": [<string>, ...],
  "suggestions": [<string>, ...],
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...]
}

Be honest and strict. A generic or poorly formatted resume should score low (below 50).
A strong, well-targeted resume with quantified achievements and relevant keywords should score high (80+).`;

  const userPrompt = `Here is the candidate's resume text extracted from their PDF:
"""
${resumeText.slice(0, 8000)}
"""

Evaluate this resume specifically for the target role: "${targetRole}".
List missing keywords/skills that recruiters and ATS systems would look for in this role.
Give 4-6 concrete, actionable suggestions to improve the resume.`;

  const raw = await callGroq(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.3, maxTokens: 1024 }
  );

  return safeParseJSON(raw, {
    atsScore: 50,
    missingKeywords: [],
    suggestions: ["Could not generate AI suggestions. Please try again."],
    strengths: [],
    weaknesses: [],
  });
}

module.exports = { analyzeResume };
