const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

dotenv.config();

// 👇 Add this line
console.log("Groq API key loaded:", !!process.env.GROQ_API_KEY);

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const codingRoutes = require("./routes/codingRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const mlRoutes = require("./routes/mlRoutes");
const profileRoutes = require("./routes/profileRoutes");
const coachRoutes = require("./routes/coachRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

connectDB();

const app = express();

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve generated PDF reports and uploaded avatars as static files
app.use("/reports", express.static(path.join(__dirname, "reports")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "AI Placement System API is running 🚀" });
});

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});