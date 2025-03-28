"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.getCategory = exports.createCategory = void 0;
const category_1 = require("../model/category");
const uploadToCloudinary_1 = require("../../../utils/uploadToCloudinary");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        if (!req.file) {
            const category = yield category_1.categoryModel.create({ title });
            res
                .status(201)
                .json({ success: true, message: "Category created", category });
        }
        else {
            const upload_result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, "product_category_uploads");
            const category = yield category_1.categoryModel.create({
                title,
                preview_image: upload_result.secure_url,
            });
            res
                .status(201)
                .json({ success: true, message: "Category created", category });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.createCategory = createCategory;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.params;
        const category = yield category_1.categoryModel.findOne({ title }).populate("products");
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Category fetched successfully",
                category,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.getCategory = getCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.categoryModel.find();
        if (!categories) {
            res.status(404).json({ success: false, message: "Categories not found" });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Categories fetched successfully",
                categories,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.getCategories = getCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, preview_image } = req.body;
        const { id } = req.params;
        const category = yield category_1.categoryModel.findById(id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
        }
        else {
            if (!preview_image) {
                yield category.updateOne({ title });
                const newCategory = yield category.save();
                res.status(201).json({
                    success: true,
                    message: "Category updated",
                    category: newCategory,
                });
            }
            else {
                yield category.updateOne({ title });
                yield category.save();
                res
                    .status(201)
                    .json({ success: true, message: "Category updated", category });
            }
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_1.categoryModel.findById(id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
        }
        else {
            yield category.deleteOne();
            res.status(200).json({
                success: true,
                message: "Category deleted successfully",
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.deleteCategory = deleteCategory;
