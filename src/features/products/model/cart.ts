import { Schema, model } from "mongoose"

const cartSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  user: {
    type: String,
    ref: "User",
  },
})

export const cartModel = model("Cart", cartSchema)
