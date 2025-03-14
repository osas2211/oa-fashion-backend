import { Request, Response } from "express"
import { productModel } from "../model/product"
import { createProductPayload } from "../../../../@types/productType"
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary"
import { categoryModel } from "../model/category"

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, price, sizes, colors, about, categoryId } =
      req.body as createProductPayload
    const textPayload = {
      title,
      price,
      sizes: JSON.parse(sizes as any),
      colors: JSON.parse(colors as any),
      about,
      categoryId,
    }
    const category = await categoryModel.findById(categoryId)
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" })
      return
    }

    const preview_image = (req.files as any).preview_image[0]
    if (!preview_image) {
      res.status(400).json({ error: "No preview image uploaded" })
      return
    }
    const upload_preview_image_result = await uploadToCloudinary(
      preview_image.buffer,
      "product_images"
    )

    if ((!req.files as any)?.subImages) {
      const product = await productModel.create({
        ...textPayload,
        image: upload_preview_image_result.secure_url,
      })
      await category.updateOne(
        {
          $push: {
            products: product,
          },
        },
        { new: true }
      )
      res
        .status(201)
        .json({ success: true, message: "Product created", product })
    } else {
      const uploadResults: string[] = []
      const subImages_files = (req.files as any).subImages
      if (subImages_files?.length) {
        for (const file of subImages_files) {
          const result = await uploadToCloudinary(file.buffer, "product_images")
          uploadResults.push(result.secure_url)
        }
      }

      const product = await productModel.create({
        ...textPayload,
        image: upload_preview_image_result.secure_url,
        subImages: uploadResults,
      })
      await category.updateOne(
        {
          $push: {
            products: product,
          },
        },
        { new: true }
      )
      res
        .status(201)
        .json({ success: true, message: "Product created", product })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const product = await productModel.findById(id)
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" })
    } else {
      res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product,
      })
    }
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.find()
    if (!products) {
      res.status(404).json({ success: false, message: "Products not found" })
    } else {
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await productModel.findById(id)
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" })
    } else {
      await product.deleteOne()
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}
