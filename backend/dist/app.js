"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const error_handler_1 = require("./middlewares/error_handler");
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const cors_options_1 = require("./libs/cors_options");
// console.log(process.env.NODE_ENV);
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
app.use((0, morgan_1.default)("tiny"));
app.use((0, cors_1.default)(cors_options_1.corsOptionsDelegate));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "500kb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.default);
app.use(error_handler_1.error_handler);
app.listen(process.env.PORT, () => {
    console.log("SERVER IS RUNNING");
});
