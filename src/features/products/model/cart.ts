import { Schema, model } from "mongoose"

const cartSchema = new Schema({
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
})

export const cartModel = model("Cart", cartSchema)
