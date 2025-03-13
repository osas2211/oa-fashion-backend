import { model, Schema } from "mongoose"

const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Fullname is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email already exist"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  avatar: {
    type: String,
    default: "",
  },

  token: {
    type: String,
  },
  otp: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
  },
})

export const userModel = model("User", userSchema)
