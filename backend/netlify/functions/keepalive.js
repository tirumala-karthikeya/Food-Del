import mongoose from "mongoose";
import { connectDB } from "../../config/db.js";

// Runs on Netlify's scheduler to keep the MongoDB Atlas cluster warm
// so the first real request doesn't pay a cold-connection penalty.
export const config = {
  schedule: "*/5 * * * *", // every 5 minutes
};

export const handler = async () => {
  try {
    await connectDB();
    await mongoose.connection.db.admin().ping();
    return { statusCode: 200, body: "pong" };
  } catch (error) {
    console.error("keepalive ping failed:", error);
    return { statusCode: 500, body: String((error && error.message) || error) };
  }
};
