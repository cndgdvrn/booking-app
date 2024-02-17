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
exports.validateToken = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const api_error_1 = __importDefault(require("../utils/api_error"));
const api_response_1 = __importDefault(require("../utils/api_response"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joiSchemas_1 = require("../libs/joiSchemas");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = joiSchemas_1.registerSchema.validate(req.body);
    if (error) {
        throw new api_error_1.default(error.details[0].message, 400, "Validation Error");
    }
    const existingUser = yield user_1.default.findOne({ email: req.body.email });
    if (existingUser) {
        throw new api_error_1.default("User already exists", 400);
    }
    const user = new user_1.default(req.body);
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
        algorithm: "HS256",
    });
    res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production" ? true : false,
    });
    yield user.save();
    return new api_response_1.default(user, "Registiration successfull").created(res);
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield joiSchemas_1.loginSchema.validateAsync(req.body);
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user) {
        throw new api_error_1.default("Invalid credentials", 400);
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new api_error_1.default("Invalid credentials", 400);
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
        algorithm: "HS256",
    });
    res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        secure: process.env.NODE_ENV === "production" ? true : false,
    });
    return new api_response_1.default(user, "Login successfull").success(res);
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("auth_token", {
        expires: new Date(0),
    });
    return new api_response_1.default(undefined, "Logout successfull").success(res);
});
exports.logout = logout;
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return new api_response_1.default({ userId: req.userId }, "Token is valid").success(res);
});
exports.validateToken = validateToken;
