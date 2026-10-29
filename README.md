<<<<<<< HEAD
# AI-Powered Smart Placement Interview System

> **Latest update (3 fixes):**
> 1. **Profile photo bug fixed** - the root cause was a missing `/uploads` proxy
>    rule in `client/vite.config.js`, so uploaded avatars were saving correctly
>    on the backend but the browser couldn't load them (404). Now fixed, plus
>    instant local preview, upload spinner, strict JPG/JPEG/PNG/WebP validation,
>    and clear error messages.
> 2. **PDF report completely rebuilt** - now a genuine 5-page ATS-friendly report
>    with a score gauge, color-coded progress bars, real tables, per-section
>    detail (Aptitude topic breakdown, all 3 mandatory coding problems, both
>    interviews, resume keywords), and an AI-generated personalized roadmap.
>    Caught and fixed two real pdfkit bugs during testing (cursor-position
>    inheritance causing squished one-word-per-line text, and a footer
>    positioned just past the page's margin box silently spawning a blank
>    extra page after every section) - verified pixel-by-pixel via page
>    image rendering before shipping, exactly 5 clean pages, zero overlap.
> 3. **Aptitude module restructured** - Full Aptitude Test (25 mixed-topic
>    questions, full-screen, 30-min timer) is now a separate, prominent entry
>    point above the topic grid. Each of the 15 topics expanded to 20
>    independently-scored practice questions (300 total in the bank, hand
>    verified for duplicate IDs and even counts), retakable anytime, with
>    AI-generated feedback (strengths/weak areas/next steps) after every
>    submission, full or topic-level.

A full-stack MERN application simulating the entire campus placement process —
resume ATS scoring, mixed-difficulty aptitude testing, **real multi-language
code execution**, AI technical/HR interviews with **webcam engagement
signals**, Google login, email password reset, an **AI Career Coach**, a
**Leaderboard**, and a final PDF report — combined with **your own trained ML
models** (placement predictor + resume quality estimator).

---

## Everything in this build

| Area | What it does |
|---|---|
| **Resume ATS Analysis** | PDF upload → Groq AI scores it 0-100 with keywords/strengths/weaknesses/suggestions. |
| **ML Resume Quality Estimator** | Your trained RandomForest+XGBoost ensemble (separate Python service) estimates Good/Average/Needs Improvement. |
| **Aptitude Test** | 15 categories, 135 questions, 20-question mixed-difficulty sessions with full navigation, palette, Mark for Review, and post-test explanations. |
| **Coding Assessment** | Monaco editor, 6 DSA questions, **real execution via Judge0** (3 questions support full Run/Submit against visible+hidden test cases in JS/Python/Java/C++/C; the other 3 are AI-review-only - see "Known limitations"). Plus AI Hint / Explain / Optimize / Find Bugs buttons. |
| **AI Interview** | Technical or HR mode, Groq asks one question at a time, browser voice input, webcam proctoring with **blink-rate + gaze signals** (same EAR technique as a drowsiness-detection project) shown as raw approximate numbers, not a fabricated "confidence score". |
| **ML Placement Predictor** | Your trained 4-model voting ensemble predicts High/Medium/Low placement likelihood from real scores + profile data. |
| **Final Report** | 5-way weighted score + ML placement prediction, downloadable PDF. |
| **AI Career Coach** | Floating chat widget on every page, grounded in your real scores, powered by Groq. |
| **Leaderboard** | Ranks users by best report score (first name + last initial shown for privacy). |
| **Google Login** | Sign in with Google (Google Identity Services + server-side token verification). |
| **Password Reset** | Real reset-link emails via Gmail SMTP (free, App Password based). |
| **Profile / Settings / Notifications** | Avatar upload, full profile editing, dark/light mode, notification bell with auto-generated alerts, password change, account deletion. |

---

## Architecture - 3 services

```
ai-placement-system/
├── client/          # React + Vite frontend
├── server/          # Node + Express + MongoDB backend
└── ml_service/      # Python + Flask - serves your trained .pkl models
```

The Node backend calls both the Python ML service (HTTP) and the Judge0 API
(external) - everything else is internal to the Node/React app.

---

## Getting Started

### 1. Prerequisites
- Node.js 18+, Python 3.10+
- MongoDB (local or free [Atlas](https://www.mongodb.com/cloud/atlas))
- Free accounts: [Groq](https://console.groq.com/keys), optionally [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce) (Judge0), [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (login), Gmail (password reset emails)

### 2. Install everything

```bash
cd ai-placement-system
npm install --prefix server
npm install --prefix client
cd ml_service && pip install -r requirements.txt --break-system-packages && cd ..
```

### 3. Configure `server/.env`

```bash
cd server && cp .env.example .env
```
Fill in what you need - **only `MONGO_URI`, `JWT_SECRET`, and `GROQ_API_KEY` are required** for the core app to work. Everything else below is optional and degrades gracefully if left blank (you'll just see a clear error toast when you try to use that specific feature, not a broken app).

| Variable | Required for | Free setup |
|---|---|---|
| `MONGO_URI`, `JWT_SECRET` | Core app | See earlier setup steps / any MongoDB Atlas free tier |
| `GROQ_API_KEY` | All AI features | https://console.groq.com/keys |
| `ML_SERVICE_URL` | ML predictions | No signup - just run `ml_service/app.py` |
| `RAPIDAPI_KEY` | Real code execution | https://rapidapi.com/judge0-official/api/judge0-ce (free tier, rate-limited) |
| `GOOGLE_CLIENT_ID` | Google login | https://console.cloud.google.com/apis/credentials → "OAuth client ID" → Web application |
| `EMAIL_USER` + `EMAIL_APP_PASSWORD` | Password reset emails | Enable 2FA on Gmail, then https://myaccount.google.com/apppasswords |

### 4. Configure `client/.env` (optional - only for Google login)

```bash
cd client && cp .env.example .env
```
Set `VITE_GOOGLE_CLIENT_ID` to the **same** Client ID as `server/.env`'s `GOOGLE_CLIENT_ID`.

### 5. Run all three services (3 terminals)

```bash
# Terminal 1 - ML microservice (start first - the placement model takes ~8s to load)
cd ml_service && python app.py

# Terminal 2 - backend
cd server && npm run dev

# Terminal 3 - frontend
cd client && npm run dev
```

Open **http://localhost:5173**.

---

## Setting up Google Login (free, ~5 minutes)

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a project (or use an existing one) → **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Under **Authorized JavaScript origins**, add `http://localhost:5173`
5. Copy the **Client ID** (ends in `.apps.googleusercontent.com`)
6. Paste it into both `server/.env` (`GOOGLE_CLIENT_ID`) and `client/.env` (`VITE_GOOGLE_CLIENT_ID`)
7. Restart both the server and client

## Setting up password-reset emails (free, ~3 minutes)

1. On the Gmail account you want to send from, enable 2-Step Verification (Google Account → Security)
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password (name it anything, e.g. "placement-system")
4. Copy the 16-character password it gives you
5. In `server/.env`: `EMAIL_USER=youraddress@gmail.com`, `EMAIL_APP_PASSWORD=<that 16-char password>` (NOT your real Gmail password)

## Setting up real code execution (free tier, ~2 minutes)

1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Sign up (free), subscribe to the **Basic (free)** plan
3. Copy your `X-RapidAPI-Key` from the code snippets shown on that page
4. Paste it into `server/.env` as `RAPIDAPI_KEY`

Note: the free tier has a daily request cap (varies, historically ~50/day) - each "Run" or "Submit" uses one request per test case. Two Sum, Valid Parentheses, and Longest Substring support full execution across all 5 languages; the other 3 questions are AI-review-only by design (see below).

---

## ⚠️ ML model calibration (read this)

**Placement predictor: fully working, no caveats** - all 10 inputs are plain
numbers from real app data/profile fields, nothing guessed.

**Resume quality model: works, but with approximate category encoding.**
4 of its 7 inputs are pre-encoded categories (Education, Job Role,
Certifications bucket, Recruiter Decision) whose original training-time
encoders weren't included with the upload - only the model + output decoder
were. `ml_service/encoders_config.py` uses placeholder alphabetical category
lists; treat its output as an approximate demo until you paste in your real
training-time category lists there (instructions are in that file).

---

## Known limitations (being upfront)

- **"Lip-sync" is an honest approximation**, not true phoneme-level lip-sync.
  Real lip-sync needs viseme timing data most free browser TTS doesn't expose.
  What you get instead: the AI avatar visibly animates (pulsing rings + a
  mouth shape) in sync with actual speech start/end, which reads as alive
  and natural without pretending to be more precise than it is.
- **Voice input** uses the browser's native SpeechRecognition (Chrome/Edge
  work best; Firefox doesn't support it at all - you'll get a clear error
  toast instead of a silent failure).
- **Code execution**: only 4 of 10 questions support real Judge0 execution
  (two-sum, valid-parentheses, longest-substring, n-queens-count - one per
  difficulty, verified across all 5 languages). The rest are AI-review-only.
- **Webcam engagement signals** (blink rate, gaze direction) are approximate
  heuristics from MediaPipe Face Mesh landmarks - genuinely useful as a rough
  proxy, but not a validated measure of confidence, emotion, or attentiveness.
- **Notification reminder types**: several notification categories exist in
  the data model (practice reminders, interview scheduling, etc.) but since
  there's no background job/cron system in this app, only event-triggered
  notifications (resume analyzed, test completed, report generated) actually
  fire today - true scheduled daily reminders would need a job scheduler.
- **AI Career Coach** is a single ongoing thread per user (not multiple
  named conversations).
- **Leaderboard** only includes users who've generated at least one report.

---

## Scoring Weights (Final Report)

```
Final Score = Resume×15% + Aptitude×20% + Coding×25% + TechnicalInterview×20% + HRInterview×20%
```
Edit in `server/services/scoringService.js`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "ML service unreachable" | Make sure `cd ml_service && python app.py` is running on port 8000. |
| "Judge0 execution failed" | Check `RAPIDAPI_KEY` is set and you haven't exceeded the free daily quota. |
| Google button doesn't render | Check `VITE_GOOGLE_CLIENT_ID` in `client/.env` and that you restarted `npm run dev`. |
| Password reset email never arrives | Check `EMAIL_USER`/`EMAIL_APP_PASSWORD`, and that you used an App Password (not your real Gmail password). Check spam folder too. |
| `GROQ_API_KEY is not set` | Check `server/.env` and restart `npm run dev` after editing it. |
| Resume Quality always shows "Average" | Expected until you calibrate `ml_service/encoders_config.py`. |
| CORS errors | Make sure `CLIENT_URL` in `server/.env` matches `http://localhost:5173`. |

---

Built as a complete, working MERN + ML + AI SaaS demo. Happy practicing! 🎯
=======
# AI-Powered-Smart-Placement-Interview-System
AI-powered placement preparation platform featuring ATS resume screening, aptitude tests, coding assessments, AI mock interviews, placement prediction, and personalized feedback.
>>>>>>> 24dd1b0818bb6edddf2aafa6101f64c602f27d9c
