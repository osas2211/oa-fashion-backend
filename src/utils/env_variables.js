"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env_variables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env_variables = {
    PORT: process.env.PORT || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    MONGO_URI: process.env.MONGO_URI || "",
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || "",
    MAIL: process.env.MAIL || "",
    BASE_URL: process.env.BASE_URL || "",
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
