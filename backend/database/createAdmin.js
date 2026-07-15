import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import user from "../models/userModel.js";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");

        const adminEmail = "admin@aura.com";
        const adminPassword = "adminpassword";

        // Check if admin already exists
        const existingAdmin = await user.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`Admin user with email ${adminEmail} already exists.`);
            existingAdmin.role = "admin";
            existingAdmin.isVerified = true;
            await existingAdmin.save();
            console.log("Updated existing user to Admin.");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 8);
        await user.create({
            firstName: "System",
            lastName: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            isVerified: true
        });

        console.log("-----------------------------------------");
        console.log("Admin user created successfully!");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log("-----------------------------------------");

        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
