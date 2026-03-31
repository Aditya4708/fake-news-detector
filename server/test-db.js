import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log("Connecting to:", process.env.MONGO_URI);

try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ CONNECTED:", conn.connection.host);
    process.exit(0);
} catch (e) {
    console.log("❌ ERROR:", e.message);
    process.exit(1);
}
