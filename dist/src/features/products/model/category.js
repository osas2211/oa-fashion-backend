"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryModel = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product",
            unique: [true, "Already added to category"],
            index: true,
            sparse: true,
            default: [],
        },
    ],
});
exports.categoryModel = (0, mongoose_1.model)("Category", categorySchema);
