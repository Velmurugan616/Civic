import mongoose from "mongoose";
import complaint from "../Models/complaintSchema.js";
import User from "../Models/userSchema.js";
import 'dotenv/config'

const PORT = process.env.PORT || 4000


export async function addComplaint(req, res) {  // Add Complaint
    try {
        // console.log(req.body);
        let userId = req.body.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        let userexists = await User.findOne({ _id: userId });
        if (!userexists) {
            return res.status(404).json({ message: "User Not Found" });
        }
        let proof = req.file ? req.file.filename : null;
        const response = await complaint.create({ ...req.body, proof });
        return res.status(200).json("Complaint Registered Successfully");
    }
    catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Error Occured" });
    }
}

export async function getallComplaints(req, res) {  // Get All Complaints
    try {
        const userId = req.params.id; // Get userId from request body
        // console.log(userId);

        // Validate userId format
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }
        // Find user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the user is an admin
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Not an admin" });
        }
        // If admin, fetch all complaints
        const complaints = await complaint.find();

        const updatedComplaints = complaints.map((comp) => ({
            ...comp._doc,
            proof: comp.proof ? `http://localhost:${PORT}/proofs/${comp.userId}/${comp.proof}` : null,
        }));

        return res.status(200).json(updatedComplaints);
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function mycomplaints(req, res) { // Get complaints by userId
    const id = req.params.id;

    try {
        const complaints = await complaint.find({ userId: id });

        const updatedComplaints = complaints.map((comp) => ({
            ...comp._doc,
            proof: comp.proof ? `http://localhost:${PORT}/proofs/${comp.userId}/${comp.proof}` : null,
        }));

        if (!updatedComplaints) {
            return res.status(404).json({ message: "No Complaints Found" });
        }
        return res.status(200).json(updatedComplaints);
    }
    catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function statusUpdate(req, res) { // Update Complaint Status
    try {
        const id = req.params.id;
        const status = req.body.status;
        const selectedcomplaint = await complaint.findById(id);

        if (!selectedcomplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        if (status !== "Resolved" && status !== "Pending" && status !== "Rejected" && status !== "Approved") {
            return res.status(400).json({ message: "Invalid Status" });
        }

        selectedcomplaint.status = status;
        if (status === "Resolved") {
            selectedcomplaint.resolvedAt = new Date().toISOString(); // Set resolved time
        } else {
            selectedcomplaint.resolvedAt = null; // Reset resolved time for other statuses
        }
        await selectedcomplaint.save();
        return res.status(200).json({ message: "Status Updated Successfully", complaint: selectedcomplaint });

    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getComplaintStats(req, res) {  // Get Complaint Stats
    try {
        // Fetch all complaints
        const complaints = await complaint.find();

        if (!complaints.length) {
            return res.status(200).json({ message: "No complaints found", stats: {} });
        }

        // Calculate total complaints
        const totalComplaints = complaints.length;

        // Count complaints by status
        const statusCounts = complaints.reduce((acc, com) => {
            acc[com.status] = (acc[com.status] || 0) + 1;
            return acc;
        }, { Pending: 0, Approved: 0, Rejected: 0, Resolved: 0 });

        // Count complaints per category
        const categoryCounts = complaints.reduce((acc, com) => {
            acc[com.type] = (acc[com.type] || 0) + 1;
            return acc;
        }, {});

        // Count complaints from the last 7 days
        const last7DaysCount = complaints.filter(com => {
            const complaintDate = new Date(com.createdAt);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return complaintDate >= sevenDaysAgo;
        }).length;

        // Response object
        const stats = {
            totalComplaints,
            statusCounts,
            categoryCounts,
            last7DaysCount
        };

        return res.status(200).json({ message: "Complaint stats fetched successfully", stats });

    } catch (error) {
        console.error("Error fetching complaint stats:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
