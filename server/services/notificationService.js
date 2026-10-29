const Notification = require("../models/Notification");

/**
 * Creates a notification for a user. Called from other controllers
 * after key events (resume analyzed, test completed, etc.) so the
 * notification bell has real, meaningful content instead of being empty.
 */
async function notify(userId, { type, title, message }) {
  try {
    return await Notification.create({ user: userId, type, title, message });
  } catch (err) {
    // Notifications are a nice-to-have - never let a notification failure
    // break the actual feature (resume upload, test submission, etc.)
    console.warn("Failed to create notification:", err.message);
    return null;
  }
}

module.exports = { notify };
