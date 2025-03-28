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
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.getProduct = exports.batchAddProducts = exports.createProduct = void 0;
const product_1 = require("../model/product");
const uploadToCloudinary_1 = require("../../../utils/uploadToCloudinary");
const category_1 = require("../model/category");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, price, sizes, colors, about, categoryId } = req.body;
        const textPayload = {
            title,
            price,
            sizes: JSON.parse(sizes),
            colors: JSON.parse(colors),
            about,
            categoryId,
        };
        const category = yield category_1.categoryModel.findById(categoryId);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }
        const preview_image = req.files.preview_image[0];
        if (!preview_image) {
            res.status(400).json({ error: "No preview image uploaded" });
            return;
        }
        const upload_preview_image_result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(preview_image.buffer, "product_images");
        if ((_a = (!req.files)) === null || _a === void 0 ? void 0 : _a.subImages) {
            const product = yield product_1.productModel.create(Object.assign(Object.assign({}, textPayload), { image: upload_preview_image_result.secure_url }));
            yield category.updateOne({
                $push: {
                    products: product,
                },
            }, { new: true });
            res
                .status(201)
                .json({ success: true, message: "Product created", product });
        }
        else {
            const uploadResults = [];
            const subImages_files = req.files.subImages;
            if (subImages_files === null || subImages_files === void 0 ? void 0 : subImages_files.length) {
                for (const file of subImages_files) {
                    const result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(file.buffer, "product_images");
                    uploadResults.push(result.secure_url);
                }
            }
            const product = yield product_1.productModel.create(Object.assign(Object.assign({}, textPayload), { image: upload_preview_image_result.secure_url, subImages: uploadResults }));
            yield category.updateOne({
                $push: {
                    products: product,
                },
            }, { new: true });
            res
                .status(201)
                .json({ success: true, message: "Product created", product });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.createProduct = createProduct;
const batchAddProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = req.body;
        const textPayload = products.map((product) => {
            const { title, price, sizes, colors, about, categoryId } = product;
            return {
                title,
                price,
                sizes: sizes,
                colors: colors,
                about,
                categoryId,
            };
        });
        products.forEach((product) => __awaiter(void 0, void 0, void 0, function* () {
            const category = yield category_1.categoryModel.findById(product.categoryId);
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: `Category: ${product.categoryId} not found`,
                });
                return;
            }
        }));
        const created_products = yield product_1.productModel.create(products);
        created_products.forEach((product) => __awaiter(void 0, void 0, void 0, function* () {
            const category = yield category_1.categoryModel.findById(product.categoryId.toString());
            if (category) {
                yield category.updateOne({
                    $push: {
                        products: product,
                    },
                }, { new: true });
            }
        }));
        res.status(201).json({
            success: true,
            message: "Products created",
            products: created_products,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.batchAddProducts = batchAddProducts;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_1.productModel.findById(id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Product fetched successfully",
                product,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.getProduct = getProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.productModel.find();
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
        });
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.getProducts = getProducts;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id } = req.params;
        const product = yield product_1.productModel.findById(id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        const body = req.body;
        const sizes = (body === null || body === void 0 ? void 0 : body.sizes) ? JSON.parse(body.sizes) : product === null || product === void 0 ? void 0 : product.sizes;
        const colors = (body === null || body === void 0 ? void 0 : body.colors)
            ? JSON.parse(body.colors)
            : product === null || product === void 0 ? void 0 : product.colors;
        const textPayload = Object.assign(Object.assign({}, body), { sizes,
            colors });
        let preview_image_url = "";
        if (req.files.preview_image) {
            const preview_image = req.files.preview_image[0];
            if (preview_image) {
                const upload_preview_image_result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(preview_image.buffer, "product_images");
                preview_image_url = upload_preview_image_result.secure_url;
            }
        }
        if ((_b = (!req.files)) === null || _b === void 0 ? void 0 : _b.subImages) {
            const updatedProduct = yield product.updateOne(Object.assign(Object.assign({}, textPayload), { image: preview_image_url || product.image }));
            yield updatedProduct.save();
            res.status(201).json({
                success: true,
                message: "Product updated",
                product: updatedProduct,
            });
        }
        else {
            const uploadResults = [];
            const subImages_files = req.files.subImages;
            if (subImages_files === null || subImages_files === void 0 ? void 0 : subImages_files.length) {
                for (const file of subImages_files) {
                    const result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(file.buffer, "product_images");
                    uploadResults.push(result.secure_url);
                }
            }
            const updatedProduct = yield product.updateOne(Object.assign(Object.assign({}, textPayload), { image: preview_image_url || product.image, subImages: uploadResults || product.subImages }));
            yield updatedProduct.save();
            res.status(201).json({
                success: true,
                message: "Product updated",
                product: updatedProduct,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_1.productModel.findById(id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
        }
        else {
            yield product.deleteOne();
            res.status(200).json({
                success: true,
                message: "Product deleted successfully",
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.deleteProduct = deleteProduct;
