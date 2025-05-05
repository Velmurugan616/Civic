import express from "express"
import { deleteuser, initial, login, register, updateuser, viewAllUsers, viewuser } from "../Controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/initial", initial)

userRouter.post("/register", register)
userRouter.post("/login", login)

userRouter.put("/update/:id", updateuser)
userRouter.delete("/delete/:id", deleteuser)

userRouter.get("/viewuser/:id", viewuser) 
userRouter.get("/viewall/:id", viewAllUsers) 


export default userRouter