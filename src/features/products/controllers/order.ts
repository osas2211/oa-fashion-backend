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

export const getUserOrders = async (req: Request, res: Response) => {
  const { id } = req.user
  try {
    const orders = await orderModel
      .find({ user: id })
      .populate("products.product")
    if (!orders) {
      res
        .status(404)
        .json({ success: false, message: "Orders does not exists" })
    } else {
      res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        orders,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.find().populate("products.product")
    if (!orders) {
      res
        .status(404)
        .json({ success: false, message: "Orders does not exists" })
    } else {
      res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        orders,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body
    const { id } = req.params
    const statusTypes = /PENDING|CANCELLED|COMPLETE/
    const isValid = statusTypes.test(status)
    if (!isValid) {
      res.status(400).json({
        success: false,
        message:
          "Order status is not one of the valid statuses -> 'PENDING', 'CANCELLED', 'COMPLETE'",
      })
      return
    }
    const order = await orderModel.findByIdAndUpdate(id, { status })
    if (!order) {
      res.status(404).json({ success: false, message: "Order does not exists" })
    } else {
      res.status(200).json({
        success: true,
        message: "Order updated successfully",
        order,
      })
    }
    return
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
    return
  }
}
