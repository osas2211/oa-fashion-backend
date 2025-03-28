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
exports.generateToken = void 0;
const env_variables_1 = require("./env_variables");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = jsonwebtoken_1.default.sign(payload, env_variables_1.env_variables.JWT_SECRET, {
            expiresIn: "1year",
        });
        return token;
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.generateToken = generateToken;
