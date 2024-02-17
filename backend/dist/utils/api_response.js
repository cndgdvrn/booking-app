"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class API_RESPONSE {
    constructor(data, message) {
        this.data = data;
        this.message = message;
    }
    success(res) {
        res.status(200).json({
            success: true,
            message: this.message || "Success - 200",
            data: this.data,
        });
    }
    created(res) {
        res.status(201).json({
            success: true,
            message: this.message || "Success - 201",
            data: this.data,
        });
    }
}
exports.default = API_RESPONSE;
