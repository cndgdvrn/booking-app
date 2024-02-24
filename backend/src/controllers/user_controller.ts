import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import API_RESPONSE from "../utils/api_response";

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.userId);
  return new API_RESPONSE(user,"Success - Get Me").success(res)
};
