import jwt from "jsonwebtoken"
import { env_variables } from "../utils/env_variables"
import { Request, Response, NextFunction } from "express"

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]
    if (!token) {
      return res.status(401).json({
        authorization: false,
        message: "No token Found",
      })
    }
    const decodedToken = jwt.verify(token, env_variables.JWT_SECRET)
    req.user = decodedToken
    return next()
  } catch (error: any) {
    res.status(401).json({ authorization: false, message: error.message })
  }
}
