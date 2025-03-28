import multer from "multer"
import path from "path"

const storage = multer.memoryStorage()

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const fileTypes = /jpeg|jpg|png|avif|webp|gif/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = fileTypes.test(file.mimetype)

  if (extname && mimeType) {
    cb(null, true)
  } else {
    cb(new Error("Only images are allowed!"))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
})

export default upload
