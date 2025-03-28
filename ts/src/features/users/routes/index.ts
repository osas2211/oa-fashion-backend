import { Router } from "express"
import {
  getUser,
  getUsers,
  resetPassword,
  signIn,
  signUp,
  updateProfile,
  verifyEmail,
  verifyPasswordResetPin,
} from "../controllers"
import { auth } from "../../../middleware/auth"
import { forAdmin } from "../../../middleware/forAdmin"

export const userRouter = Router()
userRouter.post("/signup", signUp)
userRouter.post("/verify-email", verifyEmail)
userRouter.post("/login", signIn)
userRouter.patch("/update-profile", auth, updateProfile)
userRouter.put("/reset-password", auth, resetPassword)
userRouter.put("/reset-password/confirm", auth, verifyPasswordResetPin)

userRouter.get("/user", auth, getUser)
userRouter.get("/users", auth, forAdmin, getUsers)
