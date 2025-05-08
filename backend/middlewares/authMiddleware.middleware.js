const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose")
const User = require("../models/User.model");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60,
  }),
});

const protect = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      if (!mongoose.Types.ObjectId.isValid(req.session.userId)) {
        return res.status(401).json({ message: "Not authorized. Invalid session!" });
      }
      
      req.user = await User.findById(req.session.userId).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found!" });
      }
      next();
    } else {
      res.status(401).json({ message: "Not authorized. No session!" });
    }
  } catch (e) {
    res.status(500).json({ message: "Session error", error: e.message });
  }
};

module.exports = { sessionMiddleware, protect };
