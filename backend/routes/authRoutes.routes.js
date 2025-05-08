const express = require("express");
const passport = require("../config/passport.config");
const {
  googleCallback,
  logoutUser,
  getUserProfile,
} = require("../controllers/authController.controller");
const { protect } = require("../middlewares/authMiddleware.middleware");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);
router.get("/profile", protect, getUserProfile);
router.get("/logout", protect, logoutUser);

module.exports = router;
