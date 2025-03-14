import { Request, Response } from "express"
import { productModel } from "../model/product"
import { createProductPayload } from "../../../../@types/productType"

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, price, image, subImages, sizes, colors, about, categoryId } =
      req.body as createProductPayload
    const product = await productModel.create({})
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}
