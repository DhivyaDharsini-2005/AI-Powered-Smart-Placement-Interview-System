const axios = require("axios");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Calls the Groq chat completions API (OpenAI-compatible format).
 * Groq is FREE-tier friendly and runs Llama 3 / Mixtral models extremely fast.
 *
 * @param {Array} messages - [{ role: "system"|"user"|"assistant", content: "..." }]
 * @param {Object} options - { temperature, maxTokens, jsonMode }
 */
async function callGroq(messages, options = {}) {
  const { temperature = 0.4, maxTokens = 1024 } = options;

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
    throw new Error(
      "GROQ_API_KEY is not set. Get a free key at https://console.groq.com/keys and add it to server/.env"
    );
  }

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages,
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error("Groq API error:", detail);
    throw new Error(`Groq AI request failed: ${detail}`);
  }
}

/**
 * Many of our prompts ask the model to return strict JSON.
 * Models sometimes wrap JSON in markdown fences or add stray text,
 * so this strips that out before parsing, and falls back gracefully.
 */
function safeParseJSON(rawText, fallback = {}) {
  try {
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    const jsonSlice =
      firstBrace !== -1 && lastBrace !== -1
        ? cleaned.slice(firstBrace, lastBrace + 1)
        : cleaned;
    return JSON.parse(jsonSlice);
  } catch (err) {
    console.warn("Could not parse AI JSON response, using fallback:", err.message);
    return fallback;
  }
}

module.exports = { callGroq, safeParseJSON };
