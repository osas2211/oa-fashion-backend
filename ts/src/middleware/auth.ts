import jwt from "jsonwebtoken"
import { env_variables } from "../utils/env_variables"
import { Request, Response, NextFunction } from "express"
import { userModel } from "../features/users/models"

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user: {
      fullname: string
      id: string
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]
    if (!token) {
      res.status(401).json({
        authorization: false,
        message: "No token Found",
      })
      return
    }
    const decodedToken = jwt.verify(token, env_variables.JWT_SECRET) as {
      fullname: string
      id: string
    }
    const user = await userModel.findById(decodedToken?.id)
    if (user?.token !== token) {
      res.status(401).json({
        authorization: false,
        message: "expired token",
      })
      return
    }
    req.user = decodedToken
    next()
    return
  } catch (error: any) {
    res.status(401).json({ authorization: false, message: error.message })
    return
  }
}
