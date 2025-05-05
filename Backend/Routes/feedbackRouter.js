import express from "express"
import { feedbackstatusupdate, getallfeedbacks, postfeedback } from "../Controllers/feedbackController.js"




const feedbackRouter = express.Router()

feedbackRouter.post("/post", postfeedback)
feedbackRouter.get("/getall", getallfeedbacks)
feedbackRouter.put("/update/:id", feedbackstatusupdate)

export default feedbackRouter