import { Schema, model } from "mongoose"

const collectionSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "Collection title is required"],
  },
  preview_image: {
    type: String,
    required: [true, "Collection preview_image is required"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      index: true,
    },
  ],
})

// Pre-save hook to ensure unique products within the array
collectionSchema.pre("save", function (next) {
  // @ts-ignore
  this.products = [...new Set(this.products.map((p) => p.toString()))]
  next()
})

export const collectionModel = model("Collection", collectionSchema)
