import { Request, Response } from "express"
import { cartModel } from "../model/cart"
import { orderModel } from "../model/order"

export const createOrder = async (req: Request, res: Response) => {
  try {
    const cart = await cartModel.findOne({ user: req.user.id })

    if (!cart) {
      res.status(404).json({ success: false, message: "Cart does not exists" })
    } else {
      if (cart.products.length === 0) {
        res
          .status(400)
          .json({ success: false, message: "Cart does not have any product" })
        return
      }
      const order = await orderModel.create({
        products: cart.products,
        user: req.user.id,
      })
      await cart.updateOne({
        $pullAll: {
          products: cart.products,
        },
      })
      await cart.save()
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
      })
      return
    }
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}
