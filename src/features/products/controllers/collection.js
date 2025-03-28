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
exports.deleteCollection = exports.updateCollection = exports.getCollections = exports.getCollection = exports.createCollection = void 0;
const collection_1 = require("../model/collection");
const uploadToCloudinary_1 = require("../../../utils/uploadToCloudinary");
const createCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, products } = req.body;
        const _collection = yield collection_1.collectionModel.findOne({ title });
        if (_collection) {
            res
                .status(400)
                .json({ success: false, message: "Collection already exists" });
            return;
        }
        const parsed_products = Number((products === null || products === void 0 ? void 0 : products.length) || 0) > 0 ? JSON.parse(products) : [];
        if (!req.file) {
            const collection = yield collection_1.collectionModel.create({
                title,
                products: parsed_products,
            });
            res
                .status(201)
                .json({ success: true, message: "Collection created", collection });
        }
        else {
            const upload_result = yield (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, "product_collection_uploads");
            const collection = yield collection_1.collectionModel.create({
                title,
                preview_image: upload_result.secure_url,
                products: parsed_products,
            });
            res
                .status(201)
                .json({ success: true, message: "Collection created", collection });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.createCollection = createCollection;
const getCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.params;
        const collection = yield collection_1.collectionModel
            .findOne({ title })
            .populate("products");
        if (!collection) {
            res.status(404).json({ success: false, message: "Collection not found" });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Collection fetched successfully",
                collection,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.getCollection = getCollection;
const getCollections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield collection_1.collectionModel.find();
        if (!collections) {
            res.status(404).json({ success: false, message: "Collections not found" });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Collections fetched successfully",
                collections,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.getCollections = getCollections;
const updateCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, preview_image } = req.body;
        const { id } = req.params;
        const collection = yield collection_1.collectionModel.findById(id);
        if (!collection) {
            res.status(404).json({ success: false, message: "Collection not found" });
        }
        else {
            if (!preview_image) {
                yield collection.updateOne({ title });
                const newCollection = yield collection.save();
                res.status(201).json({
                    success: true,
                    message: "Collection updated",
                    collection: newCollection,
                });
            }
            else {
                yield collection.updateOne({ title });
                yield collection.save();
                res
                    .status(201)
                    .json({ success: true, message: "Collection updated", collection });
            }
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.updateCollection = updateCollection;
const deleteCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const collection = yield collection_1.collectionModel.findById(id);
        if (!collection) {
            res.status(404).json({ success: false, message: "Collection not found" });
        }
        else {
            yield collection.deleteOne();
            res.status(200).json({
                success: true,
                message: "Collection deleted successfully",
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        return;
    }
});
exports.deleteCollection = deleteCollection;
