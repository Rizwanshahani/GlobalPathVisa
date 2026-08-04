import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGO_URI) {
        console.error("Database connection failed: MONGO_URI environment variable is not defined!");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log('mongoDB connected successfully');
    } catch (error) {
        console.error("mongodb connection failed:", error);
    }
}

export default connectDB;