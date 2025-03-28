"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
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
        type: (Array),
    },
    colors: {
        type: (Array),
    },
    sizes: {
        type: (Array),
    },
    about: {
        type: String,
        required: [true, "Product about is required"],
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Product Category is required"],
        ref: "Category",
    },
}, {
    toJSON: { virtuals: true }, // Converts _id to id in JSON responses
    toObject: { virtuals: true }, // Converts _id to id when using .toObject()
});
exports.productModel = (0, mongoose_1.model)("Product", productSchema);
