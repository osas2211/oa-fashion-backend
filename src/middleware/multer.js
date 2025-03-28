"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|avif|webp|gif/;
    const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extname && mimeType) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images are allowed!"));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});
exports.default = upload;
