"""
Category encoding configuration for resume_quality_model.pkl
================================================================
This model expects 4 pre-encoded categorical columns:
  Education_enc, Certifications_enc, Job_Role_enc, Recruiter_Decision_enc

The original LabelEncoders used during training weren't included with the
model upload (only the *output* label encoder was). The lists below are
BEST-GUESS placeholders using common values - they will only produce
correct predictions if they exactly match the unique category values (same
spelling/casing, same set - no more, no fewer) used when you trained the
model, because sklearn's LabelEncoder assigns codes by sorting categories
alphabetically and numbering them 0..n-1.

HOW TO FIX THIS PROPERLY:
1. Open the notebook/script where you trained resume_quality_model.pkl.
2. Find the lines where Education, Certifications, Job_Role, and
   Recruiter_Decision were label-encoded (e.g. df['Education_enc'] =
   LabelEncoder().fit_transform(df['Education'])).
3. Print each column's unique values: df['Education'].unique().tolist()
4. Paste those exact lists below, replacing the placeholders.
   (Order doesn't matter here - this code re-sorts them alphabetically
   to match LabelEncoder's default behavior either way.)
5. Set ENCODING_IS_CALIBRATED = True once you've done this.

Also worth knowing: 'Recruiter_Decision_enc' being a required INPUT to a
"resume quality" model is unusual - in most workflows that's an outcome,
not a feature you'd know in advance for a brand-new resume. If accuracy
matters here, consider retraining without that column.
"""

EDUCATION_CATEGORIES = [
    "High School",
    "Bachelors",
    "Masters",
    "PhD",
]

CERTIFICATIONS_CATEGORIES = [
    "None",
    "1-2",
    "3-5",
    "5+",
]

JOB_ROLE_CATEGORIES = [
    "Software Engineer",
    "Data Scientist",
    "Data Analyst",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "QA Engineer",
]

RECRUITER_DECISION_CATEGORIES = [
    "Hire",
    "Reject",
]

# Flip this to True once the lists above have been replaced with the
# real training-time category values.
ENCODING_IS_CALIBRATED = False
