"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const generateOTP = (length = 5, options = {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
}) => {
    const otp = otp_generator_1.default.generate(length, options);
    return otp;
};
exports.generateOTP = generateOTP;
