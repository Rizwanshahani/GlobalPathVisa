import express from "express";
import { createInquiry, getInquiryByTrackingId, getAllInquiries, updateInquiryStatus, exportInquiriesCSV } from "../controllers/inquiryController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create", createInquiry);
router.get("/track/:trackingId", getInquiryByTrackingId);
router.get("/all", isAuthenticated, isAdmin, getAllInquiries);
router.put("/update/:id", isAuthenticated, isAdmin, updateInquiryStatus);
router.get("/export", isAuthenticated, isAdmin, exportInquiriesCSV);

export default router;
