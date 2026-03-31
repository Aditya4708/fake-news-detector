import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        console.log("⚠️ Falling back to in-memory MongoDB because connection failed...");
        try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            const conn = await mongoose.connect(mongoUri);
            console.log(`✅ In-memory MongoDB Connected: ${conn.connection.host}`);
        } catch (memError) {
            console.error(`❌ In-memory MongoDB Error: ${memError.message}`);
            process.exit(1);
        }
    }
};

export default connectDB;
