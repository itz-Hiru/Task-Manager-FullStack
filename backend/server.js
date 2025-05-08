require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db.config");
const passport = require("./config/passport.config");

const { sessionMiddleware } = require("./middlewares/authMiddleware.middleware");

const authRoutes = require("./routes/authRoutes.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
