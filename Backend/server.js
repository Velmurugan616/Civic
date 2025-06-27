import express from "express";
import 'dotenv/config'
import cors from "cors";
import { connectdb } from "./utils/connectDB.js";
import userRouter from "./Routes/userRouter.js";
import complaintRouter from "./Routes/complaintRouter.js";
import feedbackRouter from "./Routes/feedbackRouter.js";
const app = express()

app.use(express.json())
app.use(cors({
  origin: ["http://localhost:5173", "https://civiceye.vercel.app"], // include frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use('/proofs', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // or restrict to "http://localhost:5173"
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  next();
});

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

app.get('/', (req, res) => {
  res.send("CivicEye Backend is running ✅");
});


