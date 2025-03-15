import { Request, Response } from "express"
import { productModel } from "../model/product"
import { cartModel } from "../model/cart"

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { product_id, quantity } = req.body
    const product = await productModel.findById(product_id)
    const cart = await cartModel.findOne({ user: req.user.id })
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart does not exists" })
    } else {
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" })
      } else {
        await cart.updateOne(
          {
            $push: {
              products: {
                product,
                quantity,
              },
            },
          },
          { new: true }
        )
        await cart.save()
        res
          .status(201)
          .json({ success: true, message: "Product add to cart", cart })
      }
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { item_id } = req.body
    const cart = await cartModel.findOne({ user: req.user.id })
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart does not exists" })
    } else {
      await cart.updateOne({
        $pull: {
          products: {
            _id: item_id,
          },
        },
      })
      await cart.save()
      res
        .status(200)
        .json({ success: true, message: "Product removed from cart", cart })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}

export const getUserCart = async (req: Request, res: Response) => {
  const { id } = req.user
  try {
    const cart = await cartModel.findOne({ user: id })
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart does not exists" })
    } else {
      res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        cart,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}
