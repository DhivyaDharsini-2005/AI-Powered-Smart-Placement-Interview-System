const mongoose = require("mongoose");

// Connects to MongoDB using the URI from .env
// If the connection fails, we log a clear error and exit so the
// problem is obvious immediately instead of silently failing later.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error(
      "👉 Check that MONGO_URI in your .env file is correct and MongoDB is running."
    );
    process.exit(1);
  }
};

module.exports = connectDB;
