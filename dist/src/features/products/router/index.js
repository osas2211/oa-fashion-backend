"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionRouter = exports.categoryRouter = exports.orderRouter = exports.cartRouter = exports.productRouter = void 0;
const express_1 = require("express");
const category_1 = require("../controllers/category");
const auth_1 = require("../../../middleware/auth");
const forAdmin_1 = require("../../../middleware/forAdmin");
const multer_1 = __importDefault(require("../../../middleware/multer"));
const product_1 = require("../controllers/product");
const cart_1 = require("../controllers/cart");
const order_1 = require("../controllers/order");
const collection_1 = require("../controllers/collection");
exports.productRouter = (0, express_1.Router)();
exports.cartRouter = (0, express_1.Router)();
exports.orderRouter = (0, express_1.Router)();
exports.categoryRouter = (0, express_1.Router)();
exports.collectionRouter = (0, express_1.Router)();
// PRODUCT ROUTES
exports.productRouter.post("/", auth_1.auth, forAdmin_1.forAdmin, multer_1.default.fields([
    { name: "preview_image", maxCount: 1 },
    { name: "subImages", maxCount: 10 },
]), product_1.createProduct);
exports.productRouter.post("/batch-add-products", auth_1.auth, forAdmin_1.forAdmin, product_1.batchAddProducts);
exports.productRouter.get("/:id", product_1.getProduct);
exports.productRouter.get("/", product_1.getProducts);
exports.productRouter.put("/:id", auth_1.auth, forAdmin_1.forAdmin, multer_1.default.fields([
    { name: "preview_image", maxCount: 1 },
    { name: "subImages", maxCount: 10 },
]), product_1.updateProduct);
exports.productRouter.delete("/:id", auth_1.auth, forAdmin_1.forAdmin, product_1.deleteProduct);
// CART ROUTES
exports.cartRouter.get("/", auth_1.auth, cart_1.getUserCart);
exports.cartRouter.put("/add", auth_1.auth, cart_1.addToCart);
exports.cartRouter.delete("/remove", auth_1.auth, cart_1.removeFromCart);
// ORDER ROUTES
exports.orderRouter.post("/", auth_1.auth, order_1.createOrder);
exports.orderRouter.patch("/:id", auth_1.auth, order_1.updateOrderStatus);
exports.orderRouter.get("/", auth_1.auth, order_1.getUserOrders);
exports.orderRouter.get("/all", auth_1.auth, forAdmin_1.forAdmin, order_1.getAllOrders);
// CATEGORY ROUTES
exports.categoryRouter.post("/", auth_1.auth, forAdmin_1.forAdmin, multer_1.default.single("image"), category_1.createCategory);
exports.categoryRouter.put("/:id", auth_1.auth, forAdmin_1.forAdmin, category_1.updateCategory);
exports.categoryRouter.delete("/:id", auth_1.auth, forAdmin_1.forAdmin, category_1.deleteCategory);
exports.categoryRouter.get("/:title", category_1.getCategory);
exports.categoryRouter.get("/", category_1.getCategories);
// COLLECTION ROUTES
exports.collectionRouter.post("/", auth_1.auth, forAdmin_1.forAdmin, multer_1.default.single("image"), collection_1.createCollection);
exports.collectionRouter.put("/:id", auth_1.auth, forAdmin_1.forAdmin, collection_1.updateCollection);
exports.collectionRouter.delete("/:id", auth_1.auth, forAdmin_1.forAdmin, collection_1.deleteCollection);
exports.collectionRouter.get("/:title", collection_1.getCollection);
exports.collectionRouter.get("/", collection_1.getCollections);
