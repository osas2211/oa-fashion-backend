import { Router } from "express"
import { signIn, signUp, verifyEmail } from "../controllers"

export const userRouter = Router()
userRouter.post("/signup", signUp)
userRouter.post("/verify-email", verifyEmail)
userRouter.post("/login", signIn)
