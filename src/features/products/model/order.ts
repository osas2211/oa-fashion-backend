import { Schema, model } from "mongoose"

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Reference is required"],
  },
  status: {
    type: String,
    enum: ["PENDING", "CANCELLED", "COMPLETE"],
    default: "PENDING",
  },
})

export const orderModel = model("Order", orderSchema)
