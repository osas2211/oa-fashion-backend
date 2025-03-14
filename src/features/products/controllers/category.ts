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

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { title } = req.params
    const category = await categoryModel.findOne({ title }).populate("products")
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" })
    } else {
      res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        category,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.find()
    if (!categories) {
      res.status(404).json({ success: false, message: "Categories not found" })
    } else {
      res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        categories,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { title, preview_image } = req.body as {
      title: string
      preview_image?: File
    }
    const { id } = req.params
    const category = await categoryModel.findById(id)
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" })
    } else {
      if (!preview_image) {
        await category.updateOne({ title })
        const newCategory = await category.save()
        res.status(201).json({
          success: true,
          message: "Category updated",
          category: newCategory,
        })
      } else {
        await category.updateOne({ title })
        await category.save()
        res
          .status(201)
          .json({ success: true, message: "Category updated", category })
      }
    }

    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const category = await categoryModel.findById(id)
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" })
    } else {
      await category.deleteOne()
      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}
