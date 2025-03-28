"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const env_variables_1 = require("../src/utils/env_variables");
cloudinary_1.v2.config({
    cloud_name: env_variables_1.env_variables.CLOUDINARY_NAME,
    api_key: env_variables_1.env_variables.CLOUDINARY_API_KEY,
    api_secret: env_variables_1.env_variables.CLOUDINARY_API_SECRET,
    secure: true,
});
exports.default = cloudinary_1.v2;
