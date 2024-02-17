"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT;
mongoose_1.default
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log("DB CONNECTION SUCCESSFULL"))
    .catch((err) => {
    console.log("DB CONNECTION FAILED", err.message);
});
