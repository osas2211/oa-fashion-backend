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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_variables_1 = require("./env_variables");
const sendEmail = (to_mail, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: env_variables_1.env_variables.MAIL,
                pass: env_variables_1.env_variables.MAIL_PASSWORD,
            },
        });
        yield transporter.sendMail({
            from: `"O.A Fashion"  ${env_variables_1.env_variables.MAIL}`,
            to: to_mail,
            subject: subject,
            html: body,
            priority: "high",
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.sendEmail = sendEmail;
