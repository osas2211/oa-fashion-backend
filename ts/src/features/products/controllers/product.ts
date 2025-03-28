import { Request, Response } from "express"
import { productModel } from "../model/product"
import {
  batchProductType,
  createProductPayload,
} from "../../../../@types/productType"
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

export const batchAddProducts = async (req: Request, res: Response) => {
  try {
    const products = req.body as batchProductType[]
    const textPayload = products.map((product) => {
      const { title, price, sizes, colors, about, categoryId } = product
      return {
        title,
        price,
        sizes: sizes as any,
        colors: colors as any,
        about,
        categoryId,
      }
    })

    products.forEach(async (product) => {
      const category = await categoryModel.findById(product.categoryId)
      if (!category) {
        res.status(404).json({
          success: false,
          message: `Category: ${product.categoryId} not found`,
        })
        return
      }
    })

    const created_products = await productModel.create(products)
    created_products.forEach(async (product) => {
      const category = await categoryModel.findById(
        product.categoryId.toString()
      )
      if (category) {
        await category.updateOne(
          {
            $push: {
              products: product,
            },
          },

          { new: true }
        )
      }
    })
    res.status(201).json({
      success: true,
      message: "Products created",
      products: created_products,
    })
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
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.find()
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    })
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error?.message })
    return
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await productModel.findById(id)
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" })
      return
    }
    const body = req.body as createProductPayload
    const sizes = body?.sizes ? JSON.parse(body.sizes as any) : product?.sizes
    const colors = body?.colors
      ? JSON.parse(body.colors as any)
      : product?.colors
    const textPayload = {
      // ...product,
      ...body,
      sizes,
      colors,
    }
    let preview_image_url = ""
    if ((req.files as any).preview_image) {
      const preview_image = (req.files as any).preview_image[0]
      if (preview_image) {
        const upload_preview_image_result = await uploadToCloudinary(
          preview_image.buffer,
          "product_images"
        )
        preview_image_url = upload_preview_image_result.secure_url
      }
    }

    if ((!req.files as any)?.subImages) {
      const updatedProduct = await product.updateOne({
        ...textPayload,
        image: preview_image_url || product.image,
      })
      await updatedProduct.save()

      res.status(201).json({
        success: true,
        message: "Product updated",
        product: updatedProduct,
      })
    } else {
      const uploadResults: string[] = []
      const subImages_files = (req.files as any).subImages
      if (subImages_files?.length) {
        for (const file of subImages_files) {
          const result = await uploadToCloudinary(file.buffer, "product_images")
          uploadResults.push(result.secure_url)
        }
      }

      const updatedProduct = await product.updateOne({
        ...textPayload,
        image: preview_image_url || product.image,
        subImages: uploadResults || product.subImages,
      })
      await updatedProduct.save()

      res.status(201).json({
        success: true,
        message: "Product updated",
        product: updatedProduct,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
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
