import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    status: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: String, default: "Pending" },
    completed: { type: Boolean, default: false }
});

const inquirySchema = new mongoose.Schema({
    trackingId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    destination: { type: String, required: true },
    visaType: { type: String, required: true },
    travelDate: { type: String, default: "" },
    appointmentDate: { type: String, default: "Pending Scheduling" },
    appointmentTime: { type: String, default: "" },
    status: { 
        type: String, 
        enum: ["Submitted", "Document Audit", "Appointment Booking", "Embassy Submission", "Passport Dispatched"], 
        default: "Submitted" 
    },
    timeline: { type: [timelineSchema], default: [] }
}, { timestamps: true });

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
