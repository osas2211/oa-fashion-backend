import nodemailer from "nodemailer"
import { env_variables } from "./env_variables"

export const sendEmail = async (
  to_mail: string,
  subject: string,
  body: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env_variables.MAIL,
        pass: env_variables.MAIL_PASSWORD,
      },
    })
    await transporter.sendMail({
      from: `"O.A Fashion"  ${env_variables.MAIL}`,
      to: to_mail,
      subject: subject,
      html: body,
      priority: "high",
    })
  } catch (error: any) {
    console.log(error.message)
  }
}
