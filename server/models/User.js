const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    targetRole: {
      type: String,
      default: "Software Development Engineer",
    },

    // --- Extended profile fields ---
    phone: { type: String, default: "" },
    college: { type: String, default: "" },
    department: { type: String, default: "" },
    year: { type: String, default: "" },
    cgpa: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    experience: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    // --- Fields used by the trained ML models (placement + resume quality predictors) ---
    projectsCount: { type: Number, default: 0 },
    certificationsCount: { type: Number, default: 0 },
    internshipDone: { type: Boolean, default: false },
    confidenceLevel: { type: Number, min: 1, max: 10, default: 5 }, // self-rated, used by placement model
    educationLevel: { type: String, default: "Bachelors" }, // used by resume quality model
    jobRoleCategory: { type: String, default: "Software Engineer" }, // used by resume quality model
    salaryExpectation: { type: Number, default: 0 }, // used by resume quality model

    // --- Google OAuth ---
    googleId: { type: String, default: null },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },

    // --- Password reset ---
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    // --- Notification preferences ---
    notificationPrefs: {
      resumeUpdates: { type: Boolean, default: true },
      practiceReminders: { type: Boolean, default: true },
      achievementAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Hash password before saving, but only if it was modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare plain text password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google-only account, no local password set
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
