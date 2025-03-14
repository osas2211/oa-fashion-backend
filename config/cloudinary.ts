import { v2 as cloudinary } from "cloudinary"
import { env_variables } from "../src/utils/env_variables"

cloudinary.config({
  cloud_name: env_variables.CLOUDINARY_NAME,
  api_key: env_variables.CLOUDINARY_API_KEY,
  api_secret: env_variables.CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary
