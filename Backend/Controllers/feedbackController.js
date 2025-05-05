import feedback from "../Models/feedbackSchema.js";
import User from "../Models/userSchema.js";
import mongoose from "mongoose";



export async function postfeedback(req, res) { // Add Feedback
    try {
        let userId = req.body.userId;
        let { description, timestamp } = req.body;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        let userexists = await User.findOne({ _id: userId });
        if (!userexists) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const response = await feedback.create({ userId, description, timestamp });
        return res.status(200).json({ message: "Feedback submitted successfully" });
    }
    catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Error Occured" });
    }
}

export async function getallfeedbacks(req, res) {  // Get All Feedbacks
    try {
        const feedbacks = await feedback.find(); // Get all feedbacks

        // Fetch user names for each feedback
        const feedbacksWithUserNames = await Promise.all(
            feedbacks.map(async (fb) => {
                const user = await User.findById(fb.userId).select("name");
                return {
                    _id: fb._id,
                    userId: fb.userId, // Keeping userId as raw ID
                    userName: user ? user.name : "Unknown", // Adding userName separately
                    description: fb.description,
                    timestamp: fb.timestamp,
                    status: fb.status
                };
            })
        );

        return res.status(200).json(feedbacksWithUserNames);
    }
    catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Error Occurred" });
    }
}

export async function feedbackstatusupdate(req, res) { // Update Feedback Status
    try {
        const id = req.params.id;
        const status = req.body.status;

        // Validate status
        if (status !== "Pending" && status !== "Rejected" && status !== "Accepted") {
            return res.status(400).json({ message: "Invalid Status" });
        }

        // Update feedback
        const updatedFeedback = await feedback.findByIdAndUpdate(
            id,
            { status }, // Corrected: Wrap status inside an object
            { new: true } // Returns the updated document instead of the old one
        );
        if (!updatedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        return res.status(200).json({ message: "Feedback Status Updated Successfully", feedback: updatedFeedback });

    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
