import { Schema, model } from "mongoose"

const collectionSchema = new Schema({
  title: {
    type: String,
    unique: [true, "Title already exists"],
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
      unique: [true, "Already added to collection"],
      index: true,
      sparse: true,
    },
  ],
})

export const collectionModel = model("Collection", collectionSchema)
