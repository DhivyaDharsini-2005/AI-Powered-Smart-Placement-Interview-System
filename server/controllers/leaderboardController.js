const asyncHandler = require("express-async-handler");
const Report = require("../models/Report");
const User = require("../models/User");

// @route GET /api/leaderboard
// Ranks users by their best (highest) final report score. Only shows first
// name + last initial for privacy, plus the requesting user's own rank.
const getLeaderboard = asyncHandler(async (req, res) => {
  const bestScores = await Report.aggregate([
    { $group: { _id: "$user", bestScore: { $max: "$finalScore" } } },
    { $sort: { bestScore: -1 } },
    { $limit: 50 },
  ]);

  const userIds = bestScores.map((r) => r._id);
  const users = await User.find({ _id: { $in: userIds } }).select("name");
  const userMap = new Map(users.map((u) => [u._id.toString(), u.name]));

  const leaderboard = bestScores.map((entry, i) => {
    const fullName = userMap.get(entry._id.toString()) || "Anonymous";
    const parts = fullName.split(" ");
    const displayName = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : fullName;
    return {
      rank: i + 1,
      name: displayName,
      score: entry.bestScore,
      isYou: entry._id.toString() === req.user._id.toString(),
    };
  });

  const yourRank = leaderboard.find((l) => l.isYou)?.rank || null;

  res.json({ success: true, leaderboard, yourRank });
});

module.exports = { getLeaderboard };
