"""
AI Placement System - ML Microservice
======================================
Serves Sharmi's two trained scikit-learn/XGBoost ensemble models over a
small REST API so the Node.js backend can call them like any other service.

Run with:  python app.py   (defaults to http://localhost:8000)

Endpoints:
  GET  /health
  POST /predict/placement        -> uses placement_predictor_model.pkl (fully numeric, ready to use)
  POST /predict/resume-quality   -> uses resume_quality_model.pkl (see encoders_config.py - needs calibration)
"""
import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

from encoders_config import (
    EDUCATION_CATEGORIES,
    CERTIFICATIONS_CATEGORIES,
    JOB_ROLE_CATEGORIES,
    RECRUITER_DECISION_CATEGORIES,
    ENCODING_IS_CALIBRATED,
)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

app = Flask(__name__)
CORS(app)

print("Loading ML models, this can take a few seconds (placement model is ~250MB)...")
placement_model = joblib.load(os.path.join(MODELS_DIR, "placement_predictor_model.pkl"))
placement_encoder = joblib.load(os.path.join(MODELS_DIR, "placement_label_encoder.pkl"))
resume_quality_model = joblib.load(os.path.join(MODELS_DIR, "resume_quality_model.pkl"))
resume_quality_encoder = joblib.load(os.path.join(MODELS_DIR, "resume_quality_label_encoder.pkl"))
print("Models loaded successfully ✔")

PLACEMENT_FEATURES = list(placement_model.feature_names_in_)
RESUME_QUALITY_FEATURES = list(resume_quality_model.feature_names_in_)


def encode_category(value, category_list, column_name):
    """
    Mirrors sklearn LabelEncoder's behaviour: categories are sorted
    alphabetically and assigned codes 0..n-1 in that order. This ONLY
    matches the original training-time encoding if `category_list`
    exactly matches the unique values used during training - see
    encoders_config.py for details and how to fix this once you have
    the real category lists.
    """
    sorted_categories = sorted(category_list)
    try:
        return sorted_categories.index(value)
    except ValueError:
        raise ValueError(
            f"Unknown value '{value}' for {column_name}. "
            f"Expected one of: {sorted_categories}"
        )


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "placement_model_features": PLACEMENT_FEATURES,
        "resume_quality_model_features": RESUME_QUALITY_FEATURES,
        "resume_quality_encoding_calibrated": ENCODING_IS_CALIBRATED,
    })


@app.route("/predict/placement", methods=["POST"])
def predict_placement():
    """
    Fully numeric model - no calibration needed. Expects a JSON body with:
    resume_score, aptitude_score, coding_score, technical_hr_score,
    general_hr_score, confidence_level, projects_count, certifications,
    cgpa, internship_done (0 or 1)
    """
    data = request.get_json(force=True)

    try:
        row = {feat: float(data.get(feat, 0)) for feat in PLACEMENT_FEATURES}
        df = pd.DataFrame([row])[PLACEMENT_FEATURES]
    except Exception as e:
        return jsonify({"success": False, "message": f"Invalid input: {e}"}), 400

    pred_encoded = placement_model.predict(df)
    pred_label = placement_encoder.inverse_transform(pred_encoded)[0]
    proba = placement_model.predict_proba(df)[0]
    proba_map = {
        label: round(float(p) * 100, 1)
        for label, p in zip(placement_encoder.classes_, proba)
    }

    return jsonify({
        "success": True,
        "placementLevel": pred_label,
        "probabilities": proba_map,
    })


@app.route("/predict/resume-quality", methods=["POST"])
def predict_resume_quality():
    """
    NOTE: This model was trained on 4 *encoded* categorical columns
    (Education_enc, Certifications_enc, Job_Role_enc, Recruiter_Decision_enc)
    plus 3 numeric columns (Experience (Years), Salary Expectation ($),
    Projects Count). The categorical encoders weren't provided with the
    model upload (only the *output* label encoder was) - this endpoint
    approximates them using alphabetically-sorted category lists in
    encoders_config.py.

    Until those are calibrated against the real training-time category
    lists, treat this output as an approximate demo, not a precise score -
    see encoders_config.py for how to fix this once you have the real lists.
    """
    data = request.get_json(force=True)

    try:
        row = {
            "Experience (Years)": float(data.get("experience_years", 0)),
            "Education_enc": encode_category(data.get("education"), EDUCATION_CATEGORIES, "education"),
            "Certifications_enc": encode_category(data.get("certifications"), CERTIFICATIONS_CATEGORIES, "certifications"),
            "Job_Role_enc": encode_category(data.get("job_role"), JOB_ROLE_CATEGORIES, "job_role"),
            "Recruiter_Decision_enc": encode_category(
                data.get("recruiter_decision", RECRUITER_DECISION_CATEGORIES[0]),
                RECRUITER_DECISION_CATEGORIES,
                "recruiter_decision",
            ),
            "Salary Expectation ($)": float(data.get("salary_expectation", 0)),
            "Projects Count": float(data.get("projects_count", 0)),
        }
        df = pd.DataFrame([row])[RESUME_QUALITY_FEATURES]
    except Exception as e:
        return jsonify({"success": False, "message": f"Invalid input: {e}"}), 400

    pred_encoded = resume_quality_model.predict(df)
    pred_label = resume_quality_encoder.inverse_transform(pred_encoded)[0]
    proba = resume_quality_model.predict_proba(df)[0]
    proba_map = {
        label: round(float(p) * 100, 1)
        for label, p in zip(resume_quality_encoder.classes_, proba)
    }

    return jsonify({
        "success": True,
        "qualityLevel": pred_label,
        "probabilities": proba_map,
        "calibrated": ENCODING_IS_CALIBRATED,
    })


if __name__ == "__main__":
    port = int(os.environ.get("ML_SERVICE_PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
