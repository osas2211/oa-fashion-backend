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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_variables_1 = require("../utils/env_variables");
const models_1 = require("../features/users/models");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({
                authorization: false,
                message: "No token Found",
            });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, env_variables_1.env_variables.JWT_SECRET);
        const user = yield models_1.userModel.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
        if ((user === null || user === void 0 ? void 0 : user.token) !== token) {
            res.status(401).json({
                authorization: false,
                message: "expired token",
            });
            return;
        }
        req.user = decodedToken;
        next();
        return;
    }
    catch (error) {
        res.status(401).json({ authorization: false, message: error.message });
        return;
    }
});
exports.auth = auth;
