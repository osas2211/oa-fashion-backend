import { Request, Response } from "express"
import { categoryModel } from "../model/category"

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { title, preview_image } = req.body as {
      title: string
      preview_image?: File
    }
    if (!preview_image) {
      const category = await categoryModel.create({ title })
      res
        .status(201)
        .json({ success: true, message: "Category created", category })
    } else {
      const category = await categoryModel.create({ title })
      res
        .status(201)
        .json({ success: true, message: "Category created", category })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}
