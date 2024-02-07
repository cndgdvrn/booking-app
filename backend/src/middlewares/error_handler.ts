import { Request, Response, NextFunction } from "express";
import API_ERROR from "../utils/api_error";

export const error_handler = (
  err: Error | API_ERROR,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof API_ERROR) {
    return res.status(err.getStatus).json({
      success: false,
      message: err.message,
      name: err.name,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    name: err.name,
  });
};
