import express from "express";
import 'dotenv/config'
import cors from "cors";
import { connectdb } from "./utils/connectDB.js";
import userRouter from "./Routes/userRouter.js";
import complaintRouter from "./Routes/complaintRouter.js";
import feedbackRouter from "./Routes/feedbackRouter.js";
const app = express()

app.use(express.json())
app.use(cors())

app.use("/user", userRouter)
app.use("/complaint", complaintRouter)
app.use("/feedback",feedbackRouter)
app.use('/proofs', express.static('proofs')); //  


const PORT = process.env.PORT || 4000

connectdb().then(() => {
    app.listen(PORT, () => {
        console.log("CE Backend Server Running on localhost PORT:",PORT);
    })
})



