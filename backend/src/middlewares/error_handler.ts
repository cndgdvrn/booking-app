import { Request, Response, NextFunction } from "express";
import API_ERROR from "../utils/api_error";
import Stripe from "stripe";

export const error_handler = (
  err: Error | API_ERROR | Stripe.errors.StripeAPIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Stripe.errors.StripeError) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: `There is an error in ${err.param} field -- ${err.code}`,
      type: err.type,
    });
  }

  if (err instanceof API_ERROR) {
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
