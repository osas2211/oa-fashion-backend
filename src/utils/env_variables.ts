import dotenv from "dotenv"
dotenv.config()

export const env_variables = {
  PORT: process.env.PORT || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  MONGO_URI: process.env.MONGO_URI || "",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "",
  MAIL: process.env.MAIL || "",
  BASE_URL: process.env.BASE_URL || "",
}
