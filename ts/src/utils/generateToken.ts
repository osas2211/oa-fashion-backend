import { env_variables } from "./env_variables"
import jwt from "jsonwebtoken"

export const generateToken = async (payload: {
  fullname: string
  id: string
}) => {
  try {
    const token = jwt.sign(payload, env_variables.JWT_SECRET, {
      expiresIn: "1year",
    })
    return token
  } catch (error: any) {
    console.log(error.message)
  }
}
