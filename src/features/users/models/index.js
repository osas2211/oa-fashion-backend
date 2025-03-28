"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already exist"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar: {
        type: String,
        default: "",
    },
    token: {
        type: String,
    },
    otp: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
});
exports.userModel = (0, mongoose_1.model)("User", userSchema);
