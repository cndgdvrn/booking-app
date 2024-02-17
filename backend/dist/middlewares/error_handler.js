"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_handler = void 0;
const api_error_1 = __importDefault(require("../utils/api_error"));
const error_handler = (err, req, res, next) => {
    if (err instanceof api_error_1.default) {
        return res.status(err.getStatus).json({
            success: false,
            message: err.message,
            name: err.name,
            errorCode: err.getErrorCode,
        });
    }
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error - Error occured in custrom error middleware",
        name: err.name,
    });
};
exports.error_handler = error_handler;
