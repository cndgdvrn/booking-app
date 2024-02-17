"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const messages = {
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
    "string.custom": "Email must have at least 2 characters before the @ symbol.",
};
const customEmailValidation = joi_1.default.string()
    .email()
    .required()
    .messages(messages)
    .custom((value, helpers) => {
    const atIndex = value.indexOf("@");
    if (atIndex < 2) {
        return helpers.error("string.custom");
    }
    return value;
}, "custom email validation");
const registerSchema = joi_1.default.object({
    email: customEmailValidation,
    password: joi_1.default.string()
        .min(6)
        .max(30)
        .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
        .messages({
        "string.empty": "Password field is required",
        "string.min": "Password must have at least 6 characters",
        "string.max": "Password must have at most 30 characters",
        "string.pattern.base": "Password must contain only alphanumeric characters",
    }),
    firstName: joi_1.default.string().min(2).max(30).required().messages({
        "string.empty": "First name field is required",
        "string.min": "First name must have at least 2 characters",
        "string.max": "First name must have at most 30 characters",
        "string.pattern.base": "First name must contain only alphanumeric characters",
    }),
    lastName: joi_1.default.string().min(2).max(30).required().messages({
        "string.empty": "Last name field is required",
        "string.min": "Last name must have at least 2 characters",
        "string.max": "Last name must have at most 30 characters",
        "string.pattern.base": "Last name must contain only alphanumeric characters",
    }),
});
exports.registerSchema = registerSchema;
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.empty": "Email field is required",
        "string.email": "Invalid email format",
    }),
    password: joi_1.default.string().required().messages({
        "string.empty": "Password field is required",
    }),
});
exports.loginSchema = loginSchema;
