const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Thin wrapper around the Python Flask ML microservice (ml_service/app.py),
 * which serves Sharmi's trained scikit-learn/XGBoost ensemble models.
 * This is a separate process from the Node backend - see ml_service/README
 * (and the main README) for how to run it.
 */
async function predictPlacement(features) {
  try {
    const { data } = await axios.post(`${ML_SERVICE_URL}/predict/placement`, features, {
      timeout: 10000,
    });
    return data;
  } catch (error) {
    const detail = error.response?.data?.message || error.message;
    throw new Error(
      `ML service unreachable or errored (${detail}). Make sure ml_service/app.py is running on ${ML_SERVICE_URL}.`
    );
  }
}

async function predictResumeQuality(features) {
  try {
    const { data } = await axios.post(`${ML_SERVICE_URL}/predict/resume-quality`, features, {
      timeout: 10000,
    });
    return data;
  } catch (error) {
    const detail = error.response?.data?.message || error.message;
    throw new Error(
      `ML service unreachable or errored (${detail}). Make sure ml_service/app.py is running on ${ML_SERVICE_URL}.`
    );
  }
}

module.exports = { predictPlacement, predictResumeQuality };
