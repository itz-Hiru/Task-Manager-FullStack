const User = require("../models/User.model");

const googleCallback = async (req, res) => {
  try {
    const { googleId, name, email } = req.user;

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({ googleId, name, email });
    }
    req.session.userId = user._id;

    res.redirect("/dashboard");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Google OAuth callback failed", error: error.message });
  }
};

const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Session destruction failed", error: err.message });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
};

const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
};

module.exports = { googleCallback, logoutUser, getUserProfile };
