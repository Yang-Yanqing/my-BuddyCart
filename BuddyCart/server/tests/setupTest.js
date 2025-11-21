import { beforeAll, afterAll } from "vitest";
import "../config/env";          


import db from "../config/db";

const { connectDB, disconnectDB } = db;  

beforeAll(async () => {
  console.log("[test-setup] NODE_ENV =", process.env.NODE_ENV);
  console.log("[test-setup] MONGO_URI present?", !!process.env.MONGO_URI);

  await connectDB();

  try {
    await mongoose.connection.db.collection("users").deleteMany({});
    console.log("[test-setup] Cleared users collection");
  } catch (err) {
    console.error("[test-setup] Failed to clear users collection:", err?.message);
  }
 
});

afterAll(async () => {
  await disconnectDB();
});
