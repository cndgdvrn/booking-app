"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class API_ERROR extends Error {
    constructor(message, status, errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    get getStatus() {
        return this.status;
    }
    get getErrorCode() {
        return this.errorCode;
    }
}
exports.default = API_ERROR;
