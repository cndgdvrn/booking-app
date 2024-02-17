"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify_token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_error_1 = __importDefault(require("../utils/api_error"));
const verify_token = (req, res, next) => {
    const { auth_token } = req.cookies;
    try {
        const decoded = jsonwebtoken_1.default.verify(auth_token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            res.clearCookie("auth_token");
            throw new api_error_1.default("Invalid Token", 401);
        }
        if (typeof decoded !== "object" || !decoded.hasOwnProperty("userId")) {
            res.clearCookie("auth_token");
            throw new api_error_1.default("Invalid Token", 401);
        }
        req.userId = decoded.userId;
        next();
    }
    catch (e) {
        res.clearCookie("auth_token");
        throw new api_error_1.default("Invalid Token", 401);
    }
};
exports.verify_token = verify_token;
