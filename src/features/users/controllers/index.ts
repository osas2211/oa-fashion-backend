import { Request, Response } from "express"
import { userModel } from "../models"
import bcrypt from "bcrypt"
import { generateToken } from "../../../utils/generateToken"
import { AvatarGenerator } from "random-avatar-generator"
import { generateOTP } from "../../../utils/generate-otp"
import { emailVerificationTemplate } from "../../../utils/verify_email_template"
import { sendEmail } from "../../../utils/sendMail"
import { env_variables } from "../../../utils/env_variables"

/********************************* AUTHENTICATION CONTROLS *********************************/

// POST User Sign Up
const signUp = async (req: Request, res: Response) => {
  const { fullname, password, email } = req.body
  const otp = generateOTP()
  try {
    const user_in_db = await userModel.findOne({ email })
    if (user_in_db) {
      console.log(user_in_db)
      res
        .status(400)
        .json({ userCreated: false, message: "User Already Exists" })
      return
    }
    const generator = new AvatarGenerator()

    const encryptedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({
      fullname,
      password: encryptedPassword,
      email,
      otp,
      avatar: generator.generateRandomAvatar(),
    })
    const token = await generateToken({ fullname, id: String(user._id) })
    user.token = token

    // Send Email Verification Message.
    const htmlBody = emailVerificationTemplate(
      `
      ${env_variables.BASE_URL}/auth/verify-email?user_id=${user._id}?otp=${otp}
    `,
      fullname
    )
    await sendEmail(email, "Verify Email Address", htmlBody)
    res.status(201).json({ userCreated: true, user })
    return
  } catch (err: any) {
    res.status(400).json({ userCreated: false, message: err.message })
    return
  }
}

// POST Verify Email
const verifyEmail = async (req: Request, res: Response) => {
  const { user_id, otp } = req.params

  try {
    const user = await userModel.findById(user_id)
    if (user?.verified === true) {
      res
        .status(200)
        .json({ email_verified: true, message: "user is already verified" })
      return
    }
    if (user && user.otp === otp) {
      await user.updateOne({
        $set: { verified: true, otp: user?.token?.slice(0, 10) },
      })
      res.status(200).json({ email_verified: true })
      return
    } else {
      res
        .status(400)
        .json({ email_verified: false, message: "invalid parameters" })
      return
    }
  } catch (error: any) {
    res.status(400).json({ email_verified: false, message: error.message })
    return
  }
}

// POST User Sign In
const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      res.status(401).json({
        success: false,
        message: `User authentication failed: "User does not exist"`,
      })
      return
    }
    const result = await bcrypt.compare(password, user.password)
    if (!result) {
      res.status(401).json({
        success: false,
        message: `User authentication failed: "Password is incorrect"`,
      })
      return
    }
    const token = await generateToken({
      fullname: user?.fullname,
      id: String(user._id),
    })
    user.token = token
    await user.save()
    res.status(200).json({ authenticated: true, user })
    return
  } catch (error: any) {
    res.status(400).json({ authenticated: false, message: error.message })
    return
  }
}

export { signUp, verifyEmail, signIn }
