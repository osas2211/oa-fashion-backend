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
exports.forAdmin = void 0;
const models_1 = require("../features/users/models");
const forAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const user = yield models_1.userModel.findById(id);
        if ((user === null || user === void 0 ? void 0 : user.role) !== "ADMIN") {
            res.status(401).json({
                success: false,
                message: "USER is not authorized to make this request",
            });
            return;
        }
        next();
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.forAdmin = forAdmin;
