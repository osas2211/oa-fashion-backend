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
exports.updateOrderStatus = exports.getAllOrders = exports.getUserOrders = exports.createOrder = void 0;
const cart_1 = require("../model/cart");
const order_1 = require("../model/order");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield cart_1.cartModel.findOne({ user: req.user.id });
        if (!cart) {
            res.status(404).json({ success: false, message: "Cart does not exists" });
        }
        else {
            if (cart.products.length === 0) {
                res
                    .status(400)
                    .json({ success: false, message: "Cart does not have any product" });
                return;
            }
            const order = yield order_1.orderModel.create({
                products: cart.products,
                user: req.user.id,
            });
            yield cart.updateOne({
                $pullAll: {
                    products: cart.products,
                },
            });
            yield cart.save();
            res.status(201).json({
                success: true,
                message: "Order created successfully",
                order,
            });
            return;
        }
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.createOrder = createOrder;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const orders = yield order_1.orderModel
            .find({ user: id })
            .populate("products.product");
        if (!orders) {
            res
                .status(404)
                .json({ success: false, message: "Orders does not exists" });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Orders fetched successfully",
                orders,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.getUserOrders = getUserOrders;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.orderModel.find().populate("products.product");
        if (!orders) {
            res
                .status(404)
                .json({ success: false, message: "Orders does not exists" });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Orders fetched successfully",
                orders,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.getAllOrders = getAllOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const statusTypes = /PENDING|CANCELLED|COMPLETE/;
        const isValid = statusTypes.test(status);
        if (!isValid) {
            res.status(400).json({
                success: false,
                message: "Order status is not one of the valid statuses -> 'PENDING', 'CANCELLED', 'COMPLETE'",
            });
            return;
        }
        const order = yield order_1.orderModel.findByIdAndUpdate(id, { status });
        if (!order) {
            res.status(404).json({ success: false, message: "Order does not exists" });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Order updated successfully",
                order,
            });
        }
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.updateOrderStatus = updateOrderStatus;
