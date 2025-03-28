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
exports.updateProfile = exports.verifyPasswordResetPin = exports.resetPassword = exports.getUsers = exports.getUser = exports.signIn = exports.verifyEmail = exports.signUp = void 0;
const models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../../../utils/generateToken");
const random_avatar_generator_1 = require("random-avatar-generator");
const generate_otp_1 = require("../../../utils/generate-otp");
const verify_email_template_1 = require("../../../utils/verify_email_template");
const sendMail_1 = require("../../../utils/sendMail");
const env_variables_1 = require("../../../utils/env_variables");
const cart_1 = require("../../products/model/cart");
/********************************* AUTHENTICATION CONTROLS *********************************/
// POST User Sign Up
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, password, email } = req.body;
    const otp = (0, generate_otp_1.generateOTP)();
    try {
        const generator = new random_avatar_generator_1.AvatarGenerator();
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield models_1.userModel.create({
            fullname,
            password: encryptedPassword,
            email,
            otp,
            avatar: generator.generateRandomAvatar(),
        });
        const token = yield (0, generateToken_1.generateToken)({ fullname, id: String(user._id) });
        user.token = token;
        // Send Email Verification Message.
        const htmlBody = (0, verify_email_template_1.emailVerificationTemplate)(`
      ${env_variables_1.env_variables.BASE_URL}/auth/verify-email?user_id=${user._id}?otp=${otp}
    `, fullname);
        yield (0, sendMail_1.sendEmail)(email, "Verify Email Address", htmlBody);
        // Create Cart for User
        yield cart_1.cartModel.create({ user: user.id });
        res.status(201).json({ userCreated: true, user });
        return;
    }
    catch (err) {
        res.status(400).json({ userCreated: false, message: err.message });
        return;
    }
});
exports.signUp = signUp;
// POST Verify Email
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { user_id, otp } = req.params;
    try {
        const user = yield models_1.userModel.findById(user_id);
        if ((user === null || user === void 0 ? void 0 : user.verified) === true) {
            res
                .status(200)
                .json({ email_verified: true, message: "user is already verified" });
            return;
        }
        if (user && user.otp === otp) {
            yield user.updateOne({
                $set: { verified: true, otp: (_a = user === null || user === void 0 ? void 0 : user.token) === null || _a === void 0 ? void 0 : _a.slice(0, 10) },
            });
            res.status(200).json({ email_verified: true });
            return;
        }
        else {
            res
                .status(400)
                .json({ email_verified: false, message: "invalid parameters" });
            return;
        }
    }
    catch (error) {
        res.status(400).json({ email_verified: false, message: error.message });
        return;
    }
});
exports.verifyEmail = verifyEmail;
// POST User Sign In
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield models_1.userModel.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: `User authentication failed: "User does not exist"`,
            });
            return;
        }
        const result = yield bcrypt_1.default.compare(password, user.password);
        if (!result) {
            res.status(401).json({
                success: false,
                message: `User authentication failed: "Password is incorrect"`,
            });
            return;
        }
        const token = yield (0, generateToken_1.generateToken)({
            fullname: user === null || user === void 0 ? void 0 : user.fullname,
            id: String(user._id),
        });
        user.token = token;
        yield user.save();
        res.status(200).json({ authenticated: true, user });
        return;
    }
    catch (error) {
        res.status(400).json({ authenticated: false, message: error.message });
        return;
    }
});
exports.signIn = signIn;
/********************************* IN-APP CONTROLS *********************************/
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.user.id;
    try {
        const user = yield models_1.userModel.findById(userID, [
            "-password",
            "-otp",
            "-token",
        ]);
        res.status(200).json({ user });
        return;
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
});
exports.getUser = getUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.userModel.find({}, ["-password", "-otp", "-token"]);
        if ((users === null || users === void 0 ? void 0 : users.length) !== undefined) {
            res.status(200).json({ users });
            return;
        }
        res.status(200).json({ users: users });
        return;
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
});
exports.getUsers = getUsers;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.user.id;
    const { fullname } = req.body;
    try {
        const user = yield models_1.userModel.findByIdAndUpdate(userID, { $set: { fullname } }, { new: true });
        res.status(200).json({ success: true, message: "Profile updated" });
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.updateProfile = updateProfile;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.user.id;
    const generatedOTP = (0, generate_otp_1.generateOTP)(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    try {
        const user = yield models_1.userModel.findByIdAndUpdate(userID, {
            $set: { otp: generatedOTP },
        });
        const htmlBody = `
      <p style="text-transform: capitalize;">Hello, ${user === null || user === void 0 ? void 0 : user.fullname}</p>
      <p>Your password reset pin is down below.</p>
      <h2>${generatedOTP}</h2>
      <p>If you didn't ask to reset your password, you can ignore this email.</p>
      <div>
        <p>Best Regards,</p>
        <p>The O.A Fashion.</p>
      </div>
    `;
        yield (0, sendMail_1.sendEmail)(user === null || user === void 0 ? void 0 : user.email, "Reset Password", htmlBody);
        res.status(200).json({
            success: true,
            message: `Password Reset pin sent to your email ${user === null || user === void 0 ? void 0 : user.email}`,
        });
        return;
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
});
exports.resetPassword = resetPassword;
const verifyPasswordResetPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const userID = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const { password, otp } = req.body;
    try {
        const user = yield models_1.userModel.findById(userID);
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        if (user && (user === null || user === void 0 ? void 0 : user.otp) === otp) {
            yield (user === null || user === void 0 ? void 0 : user.updateOne({
                $set: { password: encryptedPassword, otp: (_c = user === null || user === void 0 ? void 0 : user.token) === null || _c === void 0 ? void 0 : _c.slice(0, 10) },
            }));
            res.status(200).json({ password_reset: true });
            return;
        }
        else {
            res.status(400).json({ password_reset: false, message: "invalid otp" });
            return;
        }
    }
    catch (error) {
        res.status(400).json({ password_reset: false, message: error.message });
        return;
    }
});
exports.verifyPasswordResetPin = verifyPasswordResetPin;
