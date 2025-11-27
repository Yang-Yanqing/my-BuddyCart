const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("[db] MONGO_URI is missing in the environment variables!");
}


mongoose.set("strictQuery", true);

let isConnected = false;

mongoose.connection.on("connected", () => {
  isConnected = true;
  logger.info(
    { dbName: mongoose.connection.name },
    "[db] ✅ MongoDB connected successfully."
  );
});

mongoose.connection.on("error", (err) => {
  isConnected = false;
  logger.error({ err }, "[db] ❌ MongoDB connection error");
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  logger.warn("[db] ⚠️ MongoDB disconnected");
});

async function connectDB() {
  logger.info(
    { nodeEnv: process.env.NODE_ENV, mongoUri: MONGO_URI },
    "[db] Connecting to MongoDB"
  );

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
}

async function disconnectDB() {
  await mongoose.connection.close();
  isConnected = false;
  logger.info("[db] Mongo connection closed");
}

function getDbStatus() {
  return isConnected;
}

module.exports = { connectDB, disconnectDB, getDbStatus, mongoose };
