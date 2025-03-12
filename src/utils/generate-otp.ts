import otpGenerator from "otp-generator"

export const generateOTP = (
  length = 5,
  options = {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  }
) => {
  const otp = otpGenerator.generate(length, options)
  return otp
}
