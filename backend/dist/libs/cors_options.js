"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptionsDelegate = void 0;
const whiteLists = [process.env.CLIENT_URL, "https://cndgdvrn-booking-app.onrender.com"];
const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whiteLists.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true, credentials: true, methods: ["GET", "PUT", "POST", "DELETE", "PATCH"] };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};
exports.corsOptionsDelegate = corsOptionsDelegate;
