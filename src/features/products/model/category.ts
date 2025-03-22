import { Schema, Model, model } from "mongoose"

const categorySchema = new Schema({
  title: {
    type: String,
    unique: [true, "Title already exists"],
    required: [true, "Category title is required"],
  },
  preview_image: {
    type: String,
    required: [true, "Category preview_image is required"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      unique: [true, "Already added to category"],
      index: true,
      sparse: true,
      default: [],
    },
  ],
})

export const categoryModel = model("Category", categorySchema)
