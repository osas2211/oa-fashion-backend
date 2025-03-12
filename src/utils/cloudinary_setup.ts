import { v2 as cloudinaryV2 } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

export const cloudStorage = (folder_name: string) => {
  const cloudinary = cloudinaryV2
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      // public_id: (req, file) => `${folder_name}/${file.originalname}`,
      // @ts-ignore
      folder: folder_name,
    },
  })

  return storage
}
