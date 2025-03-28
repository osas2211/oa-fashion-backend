"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    products: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product is required"],
            },
            quantity: {
                type: Number,
                default: 1,
            },
            size: {
                type: String,
            },
            color: {
                type: Number,
            },
        },
    ],
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Reference is required"],
    },
    status: {
        type: String,
        enum: ["PENDING", "CANCELLED", "COMPLETE"],
        default: "PENDING",
    },
});
exports.orderModel = (0, mongoose_1.model)("Order", orderSchema);
