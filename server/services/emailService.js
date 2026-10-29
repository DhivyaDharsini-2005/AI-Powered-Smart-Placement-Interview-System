const nodemailer = require("nodemailer");

// Uses Gmail SMTP with an App Password (free - no paid email service needed).
// Setup: enable 2FA on the Gmail account, then create an "App Password" at
// https://myaccount.google.com/apppasswords and use that (not your real
// Gmail password) as EMAIL_APP_PASSWORD.
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error(
      "EMAIL_USER / EMAIL_APP_PASSWORD not set in server/.env - see README for free Gmail App Password setup."
    );
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
  });
}

async function sendPasswordResetEmail(toEmail, resetUrl, userName) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"AI Placement System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your password - AI Placement System",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Reset your password</h2>
        <p>Hi ${userName || "there"},</p>
        <p>We received a request to reset your password. Click the button below to set a new one. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#6366f1;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;margin:16px 0;">Reset Password</a>
        <p style="color:#888;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
