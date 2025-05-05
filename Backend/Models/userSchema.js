import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
})


const user = mongoose.model("user", userSchema)
export default user
