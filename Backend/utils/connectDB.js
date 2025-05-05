import mongoose from "mongoose";
import 'dotenv/config'


const URL = process.env.MDBURL

export async function connectdb() {
    try {
        await mongoose.connect(URL)
        console.log("DB Connected");

    } catch (error) {
        console.error("DB Connection Error", error);
    }
}