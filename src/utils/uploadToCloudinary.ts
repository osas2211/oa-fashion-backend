import cloudinary from "../../config/cloudinary"
import streamifier from "streamifier"

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) {
          resolve(result)
        } else {
          reject(error)
        }
      }
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })
}
