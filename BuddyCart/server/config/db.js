// config/db.js
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("[db] MONGO_URI is missing in the environment variables!");
}

mongoose.set("strictQuery", true);

mongoose.connection.on("connected", () => {
  console.log("[db] ✅ MongoDB connected successfully. DB name:", mongoose.connection.name);
});

mongoose.connection.on("error", (err) => {
  console.error("[db] ❌ MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("[db] ⚠️ MongoDB disconnected");
});

async function connectDB() {
  console.log("[db] NODE_ENV =", process.env.NODE_ENV);
  console.log("[db] Connecting to:", MONGO_URI);

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000, 
  });
}

async function disconnectDB() {
  await mongoose.connection.close();
  console.log("[db] Mongo connection closed");
}


module.exports = { connectDB, disconnectDB, mongoose };
