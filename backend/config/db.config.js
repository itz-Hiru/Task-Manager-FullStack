const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected.");
  } catch (e) {
    console.error("Error while connecting MongoDB", e);
    process.exit(404);
  }
};

module.exports = connectDB;