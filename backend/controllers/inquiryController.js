import Inquiry from "../models/inquiryModel.js";

// 1. Create a new inquiry
export const createInquiry = async (req, res) => {
    try {
        const { trackingId, fullName, email, phone, destination, visaType, travelDate } = req.body;

        if (!trackingId || !fullName || !email || !phone || !destination || !visaType) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        // Create standard timeline
        const timeline = [
            { status: "Submitted", description: "Inquiry received. A visa specialist will review your details shortly.", date: new Date().toLocaleDateString(), completed: true },
            { status: "Document Audit", description: "Visa specialist auditing documents", date: "Pending", completed: false },
            { status: "Appointment Booking", description: "Securing slot at Embassy/VFS", date: "Pending", completed: false },
            { status: "Embassy Submission", description: "Visa file submitted for processing", date: "Pending", completed: false },
            { status: "Passport Dispatched", description: "Decision made and passport in transit", date: "Pending", completed: false }
        ];

        const newInquiry = await Inquiry.create({
            trackingId,
            fullName,
            email,
            phone,
            destination,
            visaType,
            travelDate,
            timeline
        });

        return res.status(201).json({
            success: true,
            message: "Inquiry created successfully",
            inquiry: newInquiry
        });
    } catch (error) {
        console.error("Create inquiry error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 2. Get inquiry by tracking ID
export const getInquiryByTrackingId = async (req, res) => {
    try {
        const { trackingId } = req.params;
        const inquiry = await Inquiry.findOne({ trackingId: trackingId.toUpperCase() });

        if (!inquiry) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }

        return res.status(200).json({ success: true, inquiry });
    } catch (error) {
        console.error("Get inquiry error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 3. Get all inquiries (Admins only)
export const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, inquiries });
    } catch (error) {
        console.error("Get all inquiries error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 4. Update inquiry status and timeline (Admins only)
export const updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, appointmentDate, appointmentTime, timeline } = req.body;

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }

        if (status) inquiry.status = status;
        if (appointmentDate) inquiry.appointmentDate = appointmentDate;
        if (appointmentTime) inquiry.appointmentTime = appointmentTime;
        if (timeline) inquiry.timeline = timeline;

        await inquiry.save();

        return res.status(200).json({
            success: true,
            message: "Inquiry updated successfully",
            inquiry
        });
    } catch (error) {
        console.error("Update inquiry error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 5. Export inquiries to CSV (Excel format)
export const exportInquiriesCSV = async (req, res) => {
    try {
        // Find inquiries created today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch inquiries (can support filtering by date, default is all/daily)
        const inquiries = await Inquiry.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: -1 });

        // Generate CSV content
        let csvContent = "\uFEFF"; // Byte Order Mark for Excel UTF-8 support
        csvContent += "Tracking ID,Full Name,Email,Phone,Destination,Visa Type,Travel Date,Appointment Date,Appointment Time,Status,Created At\n";

        inquiries.forEach(inq => {
            const row = [
                inq.trackingId,
                inq.fullName,
                inq.email,
                inq.phone,
                inq.destination,
                inq.visaType,
                inq.travelDate || "",
                inq.appointmentDate || "",
                inq.appointmentTime || "",
                inq.status,
                inq.createdAt ? inq.createdAt.toLocaleString() : ""
            ].map(val => `"${String(val).replace(/"/g, '""')}"`);

            csvContent += row.join(",") + "\n";
        });

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename=inquiries_${new Date().toISOString().split('T')[0]}.csv`);
        return res.status(200).send(csvContent);
    } catch (error) {
        console.error("Export inquiries error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
