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
exports.getUserCart = exports.removeFromCart = exports.addToCart = void 0;
const product_1 = require("../model/product");
const cart_1 = require("../model/cart");
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id, quantity } = req.body;
        const product = yield product_1.productModel.findById(product_id);
        const cart = yield cart_1.cartModel.findOne({ user: req.user.id });
        if (!cart) {
            res.status(404).json({ success: false, message: "Cart does not exists" });
        }
        else {
            if (!product) {
                res.status(404).json({ success: false, message: "Product not found" });
            }
            else {
                yield cart.updateOne({
                    $push: {
                        products: {
                            product,
                            quantity,
                        },
                    },
                }, { new: true });
                yield cart.save();
                res
                    .status(201)
                    .json({ success: true, message: "Product add to cart", cart });
            }
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id } = req.body;
        const cart = yield cart_1.cartModel.findOne({ user: req.user.id });
        if (!cart) {
            res.status(404).json({ success: false, message: "Cart does not exists" });
        }
        else {
            yield cart.updateOne({
                $pull: {
                    products: {
                        _id: item_id,
                    },
                },
            });
            yield cart.save();
            res
                .status(200)
                .json({ success: true, message: "Product removed from cart", cart });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.removeFromCart = removeFromCart;
const getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const cart = yield cart_1.cartModel
            .findOne({ user: id })
            .populate("products.product");
        if (!cart) {
            res.status(404).json({ success: false, message: "Cart does not exists" });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                cart,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.getUserCart = getUserCart;
