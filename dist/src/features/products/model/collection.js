"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionModel = void 0;
const mongoose_1 = require("mongoose");
const collectionSchema = new mongoose_1.Schema({
    title: {
        type: String,
        unique: [true, "Collection already exists"],
        required: [true, "Collection title is required"],
    },
    preview_image: {
        type: String,
        required: [true, "Collection preview_image is required"],
    },
    products: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product",
            index: true,
        },
    ],
});
// Pre-save hook to ensure unique products within the array
collectionSchema.pre("save", function (next) {
    // @ts-ignore
    this.products = [...new Set(this.products.map((p) => p.toString()))];
    next();
});
exports.collectionModel = (0, mongoose_1.model)("Collection", collectionSchema);
