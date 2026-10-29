const axios = require("axios");

// Judge0 CE via RapidAPI - free tier (50 requests/day on the Basic plan as of
// writing). Get your own key at https://rapidapi.com/judge0-official/api/judge0-ce
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";

// Judge0 language IDs (CE instance) for the languages this platform supports
const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java (OpenJDK 13)
  cpp: 54,        // C++ (GCC 9.2.0)
  c: 50,          // C (GCC 9.2.0)
};

function getHeaders() {
  if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === "your_rapidapi_key_here") {
    throw new Error(
      "RAPIDAPI_KEY is not set. Get a free key at https://rapidapi.com/judge0-official/api/judge0-ce and add it to server/.env"
    );
  }
  return {
    "content-type": "application/json",
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  };
}

/**
 * Submits source code + stdin to Judge0 and waits (blocking, via ?wait=true)
 * for the result. Returns Judge0's raw result object (stdout, stderr, time,
 * memory, status, etc).
 */
async function runSubmission({ language, code, stdin = "" }) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    throw new Error(`Unsupported language for execution: ${language}`);
  }

  try {
    const { data } = await axios.post(
      `${JUDGE0_URL}/submissions`,
      {
        source_code: code,
        language_id: languageId,
        stdin,
      },
      {
        params: { base64_encoded: "false", wait: "true" },
        headers: getHeaders(),
        timeout: 20000,
      }
    );
    return data;
  } catch (error) {
    const detail = error.response?.data?.message || error.message;
    throw new Error(`Judge0 execution failed: ${detail}`);
  }
}

/**
 * Runs the same code against multiple test cases sequentially (Judge0's free
 * tier doesn't support efficient batch submission, so this is one request
 * per test case - fine for a handful of test cases per question).
 */
async function runTestCases({ language, code, testCases }) {
  const results = [];
  for (const tc of testCases) {
    const result = await runSubmission({ language, code, stdin: tc.input });
    const actualOutput = (result.stdout || "").trim();
    const expectedOutput = (tc.expectedOutput || "").trim();
    results.push({
      input: tc.input,
      expectedOutput,
      actualOutput,
      passed: actualOutput === expectedOutput,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status?.description,
      time: result.time,
      memory: result.memory,
      hidden: tc.hidden || false,
    });
  }
  return results;
}

module.exports = { runSubmission, runTestCases, LANGUAGE_IDS };
