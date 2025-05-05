import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    status: {   
        type: String,
        enum: ["Pending", "Accepted","Rejected"],
        default: "Pending"

    }
})

const feedback = mongoose.model("feedback", feedbackSchema)
export default feedback