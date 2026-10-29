const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Resume = require("../models/Resume");
const Aptitude = require("../models/Aptitude");
const Coding = require("../models/Coding");
const Interview = require("../models/Interview");
const Notification = require("../models/Notification");

const EDITABLE_FIELDS = [
  "name", "targetRole", "phone", "college", "department", "year", "cgpa",
  "github", "linkedin", "portfolio", "bio", "skills", "experience",
  "projectsCount", "certificationsCount", "internshipDone", "confidenceLevel",
  "educationLevel", "jobRoleCategory", "salaryExpectation", "notificationPrefs",
];

// @route GET /api/profile
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ success: true, user });
});

// @route PUT /api/profile
const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  EDITABLE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  await user.save();
  const safeUser = await User.findById(user._id).select("-password");
  res.json({ success: true, user: safeUser });
});

// @route POST /api/profile/avatar  (multipart, field name: "avatar")
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file uploaded. Attach an image under field 'avatar'.");
  }

  const user = await User.findById(req.user._id);
  user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
  await user.save();

  res.json({ success: true, avatarUrl: user.avatarUrl });
});

// @route PUT /api/profile/password   { currentPassword, newPassword }
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user.authProvider === "google" && !user.password) {
    res.status(400);
    throw new Error("This account signed up with Google and has no password to change.");
  }
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }
  if (!newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  user.password = newPassword; // pre-save hook will hash it
  await user.save();
  res.json({ success: true, message: "Password updated successfully" });
});

// @route DELETE /api/profile   (deletes the account and all associated data)
const deleteMyAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Promise.all([
    Resume.deleteMany({ user: userId }),
    Aptitude.deleteMany({ user: userId }),
    Coding.deleteMany({ user: userId }),
    Interview.deleteMany({ user: userId }),
    Notification.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);
  res.json({ success: true, message: "Account and all associated data deleted" });
});

module.exports = { getMyProfile, updateMyProfile, uploadAvatar, changePassword, deleteMyAccount };
