const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const generateToken = require("../utils/tokenUtils");
const { sendPasswordResetEmail } = require("../services/emailService");

const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    targetRole: user.targetRole,
    avatarUrl: user.avatarUrl,
    authProvider: user.authProvider,
  };
}

// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, targetRole } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are all required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({
    name, email, password,
    targetRole: targetRole || "Software Development Engineer",
  });

  res.status(201).json({ success: true, user: publicUser(user), token: generateToken(user._id) });
});

// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({ success: true, user: publicUser(user), token: generateToken(user._id) });
});

// @route POST /api/auth/google   { idToken }
// Verifies the Google ID token (from Google Identity Services on the frontend),
// then finds-or-creates a matching user and logs them in.
const googleLogin = asyncHandler(async (req, res) => {
  if (!googleClient) {
    res.status(500);
    throw new Error(
      "Google login isn't configured. Set GOOGLE_CLIENT_ID in server/.env - see README for free setup steps."
    );
  }

  const { idToken } = req.body;
  if (!idToken) {
    res.status(400);
    throw new Error("Missing Google idToken");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch (err) {
    res.status(401);
    throw new Error("Invalid Google token");
  }

  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

  if (!user) {
    user = await User.create({
      name, email: email.toLowerCase(), googleId,
      authProvider: "google", avatarUrl: picture || "",
      password: undefined,
    });
  } else if (!user.googleId) {
    // Existing local account signing in with Google for the first time - link it
    user.googleId = googleId;
    if (!user.avatarUrl) user.avatarUrl = picture || "";
    await user.save();
  }

  res.json({ success: true, user: publicUser(user), token: generateToken(user._id) });
});

// @route POST /api/auth/forgot-password   { email }
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() });

  // Always respond success-looking to avoid leaking which emails are registered
  if (!user) {
    return res.json({ success: true, message: "If that email is registered, a reset link has been sent." });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl, user.name);
  } catch (err) {
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.status(500);
    throw new Error(`Could not send reset email: ${err.message}`);
  }

  res.json({ success: true, message: "If that email is registered, a reset link has been sent." });
});

// @route POST /api/auth/reset-password/:token   { newPassword }
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Reset link is invalid or has expired. Please request a new one.");
  }
  if (!req.body.newPassword || req.body.newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  user.password = req.body.newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ success: true, message: "Password reset successfully. You can now log in." });
});

// @route GET /api/auth/profile
const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.targetRole = req.body.targetRole || user.targetRole;
  await user.save();

  res.json({ success: true, user: publicUser(user) });
});

module.exports = {
  registerUser, loginUser, googleLogin, forgotPassword, resetPassword, getProfile, updateProfile,
};
