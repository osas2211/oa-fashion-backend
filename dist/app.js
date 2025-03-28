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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const env_variables_1 = require("./src/utils/env_variables");
const http_1 = __importDefault(require("http"));
const db_1 = require("./src/db/db");
const routes_1 = require("./src/features/users/routes");
const router_1 = require("./src/features/products/router");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.userRouter);
app.use("/api/v1/product", router_1.productRouter);
app.use("/api/v1/cart", router_1.cartRouter);
app.use("/api/v1/order", router_1.orderRouter);
app.use("/api/v1/category", router_1.categoryRouter);
app.use("/api/v1/collection", router_1.collectionRouter);
app.get("/", (_, res) => {
    res
        .status(200)
        .json({ connected: true, message: "WELCOME TO THE O.A FASHION" });
    return;
});
const server = http_1.default.createServer(app);
const port = env_variables_1.env_variables.PORT || 10000;
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        console.log("db connected");
        console.log(`server is running at PORT ${port}`);
    }
    catch (error) {
        console.log(error.message);
    }
}));
