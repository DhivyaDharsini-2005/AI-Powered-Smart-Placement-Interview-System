const asyncHandler = require("express-async-handler");
const { predictPlacement, predictResumeQuality } = require("../services/mlService");
const { getAllScores } = require("../services/statsService");

// Buckets a raw certification count into the category labels the
// resume-quality model was trained on (see ml_service/encoders_config.py).
function bucketCertifications(count) {
  if (count <= 0) return "None";
  if (count <= 2) return "1-2";
  if (count <= 4) return "3-5";
  return "5+";
}

// @route GET /api/ml/placement-prediction
// Uses the trained VotingClassifier (RandomForest+XGBoost+GradientBoosting+ExtraTrees)
// to predict High/Medium/Low placement likelihood from the candidate's real scores + profile.
const getPlacementPrediction = asyncHandler(async (req, res) => {
  const user = req.user;
  const scores = await getAllScores(user._id);

  const cgpaNumeric = parseFloat(user.cgpa) || 0;

  const result = await predictPlacement({
    resume_score: scores.resumeScore,
    aptitude_score: scores.aptitudeScore,
    coding_score: scores.codingScore,
    technical_hr_score: scores.technicalInterviewScore,
    general_hr_score: scores.hrInterviewScore,
    confidence_level: user.confidenceLevel,
    projects_count: user.projectsCount,
    certifications: user.certificationsCount,
    cgpa: cgpaNumeric,
    internship_done: user.internshipDone ? 1 : 0,
  });

  res.json({ success: true, ...result, inputsUsed: { ...scores, cgpa: cgpaNumeric } });
});

// @route POST /api/ml/resume-quality   (optional body: { recruiter_decision })
// Uses the trained ensemble resume-quality model. NOTE: category encodings
// are approximate pending calibration - see ml_service/encoders_config.py.
const getResumeQualityPrediction = asyncHandler(async (req, res) => {
  const user = req.user;
  const experienceYears = parseFloat(user.experience) || 0;

  const result = await predictResumeQuality({
    experience_years: experienceYears,
    education: user.educationLevel,
    certifications: bucketCertifications(user.certificationsCount),
    job_role: user.jobRoleCategory,
    recruiter_decision: req.body?.recruiter_decision || "Hire",
    salary_expectation: user.salaryExpectation,
    projects_count: user.projectsCount,
  });

  res.json({ success: true, ...result });
});

module.exports = { getPlacementPrediction, getResumeQualityPrediction };
