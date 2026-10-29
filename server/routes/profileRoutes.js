const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  changePassword,
  deleteMyAccount,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const avatarUpload = require("../middleware/avatarUploadMiddleware");

router.get("/", protect, getMyProfile);
router.put("/", protect, updateMyProfile);
router.post("/avatar", protect, avatarUpload.single("avatar"), uploadAvatar);
router.put("/password", protect, changePassword);
router.delete("/", protect, deleteMyAccount);

module.exports = router;
