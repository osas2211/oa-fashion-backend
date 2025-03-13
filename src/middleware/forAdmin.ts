import { NextFunction, Request, Response } from "express"
import { userModel } from "../features/users/models"

export const forAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user
    const user = await userModel.findById(id)
    if (user?.role !== "ADMIN") {
      res.status(401).json({
        success: false,
        message: "USER is not authorized to make this request",
      })
      return
    }
    next()
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}
