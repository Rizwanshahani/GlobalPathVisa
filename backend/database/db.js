import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (mongoose.connection.readyState === 2) {
        // Wait for the ongoing connection to establish
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (mongoose.connection.readyState === 1) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
        return;
    }

    if (!process.env.MONGO_URI) {
        console.error("Database connection failed: MONGO_URI environment variable is not defined!");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of default 30s
        });
        console.log('mongoDB connected successfully');
    } catch (error) {
        console.error("mongodb connection failed:", error);
    }
}

export default connectDB;