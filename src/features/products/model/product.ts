import { Schema, model } from "mongoose"

const productSchema = new Schema({
  title: {
    type: String,
    required: [true, "Product Title is required"],
  },
  price: {
    type: Number,
    required: [true, "Product Price is required"],
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  subImages: {
    type: Array<String>,
  },
  colors: {
    type: Array<String>,
  },
  sizes: {
    type: Array<String>,
  },
  about: {
    type: String,
    required: [true, "Product about is required"],
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: [true, "Product Category is required"],
    ref: "Category",
  },
})

export const productModel = model("Product", productSchema)
