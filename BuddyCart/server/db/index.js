const mongoose = require("mongoose");


const URI = process.env.MONGO_URI || process.env.MONGODB_URI;

console.log("MONGO_URI present?", !!process.env.MONGO_URI, "MONGODB_URI present?", !!process.env.MONGODB_URI);

if (!URI) {
  console.error("❌ No Mongo URI found. Set MONGO_URI to your Atlas SRV string.");
  
}

mongoose.set("strictQuery", true);

mongoose.connection.on("connected", () => console.log("✅ MongoDB connected successfully"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB connection error:", err.message));
mongoose.connection.on("disconnected", () => console.warn("⚠️ MongoDB disconnected"));

(async () => {
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`Connected to Mongo! Database name: "${mongoose.connection.name}"`);
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.name, err.message);
  }
})();

module.exports = mongoose;
