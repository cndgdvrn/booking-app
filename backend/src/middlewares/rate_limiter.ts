import rateLimit, { Options } from "express-rate-limit";
import API_ERROR from "../utils/api_error";
import { Request, Response, NextFunction } from "express";

const rateLimiter = rateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: "You have made too many requests, please try again later...",
  handler: (req: Request, res: Response, next: NextFunction, options: Options) => {
    throw new API_ERROR(options.message, options.statusCode);
  },
});

module.exports = { rateLimiter };
