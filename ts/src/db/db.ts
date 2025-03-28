import mongoose from "mongoose"
import { env_variables } from "../utils/env_variables"

export const connectDB = async () => {
  await mongoose.connect(env_variables.MONGO_URI)
}
